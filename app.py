import json
import os
import threading
import time
from datetime import datetime

import cv2
import numpy as np
from flask import Flask, send_from_directory, jsonify
from ultralytics import YOLO
from collections import Counter
from flask_cors import CORS

from local_db import LocalDB

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Disable CORS for all routes


def read_cctv_list():
    # Open and read the JSON file
    with open('static/cctv-bandung.json', 'r') as file:
        data_ = json.load(file)
    return data_


# --------- CONFIGURATION ---------
threadDelay = 3600  # delay in second
streamDir = './streams/'  # output directory for the streamed images and data
jpegQuality = 50  # JPEG quality for saving images

# yoloModelPath = "./static/yolo11n.pt"  # path to the YOLO model
# yoloObjClass = {2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck'}  # object classes to track original

yoloModelPath = "./static/bestmodel_22Nov.pt"
yoloObjClass = {1: 'car', 2: 'motorcycle', 0: 'bus', 3: 'truck'}

# --------- INITIALIZE ---------
allCCTVs = read_cctv_list()  # get all cctv data
# cctvIndex = [i for i in range(len(allCCTVs))]  # get all cctv data
cctvIndex = [i for i in range(6)]  # get cctv in range

cctvList = [allCCTVs[i] for i in cctvIndex]

trackingClassId = list(yoloObjClass.keys())  # list of class IDs to track
yoloModel = YOLO(yoloModelPath)  # load the YOLO model
cctvLatestData = []


def capture_cctv(timestamp, cctv, thread_id):
    cctv_url = cctv['stream_cctv']
    cctv_no = cctv['no']
    roi_polygons = cctv.get('roi_polygon', [])  # Get ROI polygons from cctv data

    if not roi_polygons:
        print(f"Skipping CCTV {cctv_no} as no ROI is defined.")
        return

    cap = cv2.VideoCapture(cctv_url)

    if not cap.isOpened():
        print(f"Error: Could not open video stream for URL {cctv_url}")
        cap.release()
        return

    print(f"Starting capture on thread {thread_id} for URL: {cctv_url}")

    success, frame = cap.read()
    if not success:
        print(f"End of stream or error fetching frame for URL {cctv_url}")
        cap.release()
        return

    results = yoloModel(frame, classes=trackingClassId)

    if results is None or len(results[0].boxes) == 0:
        print(f"No objects detected in frame for URL {cctv_url}")
        cap.release()
        return

    # Filter objects based on ROI
    filtered_boxes = []
    for box in results[0].boxes:
        x_min, y_min, x_max, y_max = box.xyxy[0].tolist()
        center_x = (x_min + x_max) / 2
        center_y = (y_min + y_max) / 2
        for polygon in roi_polygons:
            polygon_array = np.array(polygon, dtype=np.int32)
            if cv2.pointPolygonTest(polygon_array, (center_x, center_y), False) >= 0:
                filtered_boxes.append(box)
                break

    if not filtered_boxes:
        print(f"No objects detected within ROI for URL {cctv_url}")
        cap.release()
        return

    # Count objects
    data_count_ = {yoloObjClass[k]: v for k, v in Counter([int(box.cls.item()) for box in filtered_boxes]).items() if
                   k in yoloObjClass}
    results_ = {
        "cls": [int(box.cls.item()) for box in filtered_boxes],
        "conf": [float(box.conf.item()) for box in filtered_boxes],
        "count": data_count_,
        "total": sum(data_count_.values())
    }

    # Define colors for each class
    class_colors = {
        0: (128, 0, 128),  # Purple for class 0
        1: (255, 255, 0),  # Blue for class 1
        2: (255, 255, 255),  # White for class 2
        3: (0, 255, 0)  # Green for class 3
    }

    # Plot the results with custom colors for each class
    frame_with_detections = frame.copy()
    for box in filtered_boxes:
        x_min, y_min, x_max, y_max = map(int, box.xyxy[0].tolist())
        class_id = int(box.cls.item())

        # Use class_colors to get the color for the current class
        color = class_colors.get(class_id, (0, 0, 255))  # Default to red if class is not in dictionary

        # Draw the bounding box with a thinner line (thickness=1)
        cv2.rectangle(frame_with_detections, (x_min, y_min), (x_max, y_max), color, 1)

    # Draw ROI polygons in red (fixed color for ROI) with thinner lines
    for polygon in roi_polygons:
        polygon_array = np.array(polygon, dtype=np.int32)
        cv2.polylines(frame_with_detections, [polygon_array], isClosed=True, color=(0, 0, 255), thickness=1)

    # Save the frame as an image
    image_filename = os.path.join(streamDir, "images/",
                                  f"{cctv_no}_{timestamp}.jpg")  # Generate timestamp-based filename
    os.makedirs(os.path.dirname(image_filename), exist_ok=True)
    cv2.imwrite(image_filename, frame_with_detections, [cv2.IMWRITE_JPEG_QUALITY, jpegQuality])

    # Save the data as a JSON file
    json_filename = os.path.join(streamDir, "data/", f"{cctv_no}_{timestamp}.json")
    os.makedirs(os.path.dirname(json_filename), exist_ok=True)
    with open(json_filename, 'w') as file:
        json.dump(results_, file, indent=1)

    cap.release()


def get_latest_cctv_data(ts, timestamp):
    global cctvLatestData
    cctv_list_ = [cctv for cctv in cctvList if cctv.get('roi_polygon')]

    results_ = {
        "timestamp": timestamp,
        "data": []
    }
    tmp_data = []
    for cctv in cctv_list_:
        filename = os.path.join(streamDir, "data/", f"{cctv['no']}_{timestamp}.json")
        if os.path.exists(filename):
            with open(filename, 'r') as file:
                try:
                    data = json.load(file)
                    tmp_data.append({
                        "cctv": cctv,
                        "data": data
                    })
                except json.decoder.JSONDecodeError:
                    print(f"Error decoding JSON file: {filename}")

    results_["data"] = sorted(tmp_data, key=lambda x: x["data"]["total"], reverse=True)

    # Save data to local database
    db_ = LocalDB()
    db_.open_db()
    db_.add_cctv_history(ts, timestamp, results_["data"])
    db_.close_db()

    cctvLatestData = results_


def periodic_task():
    cctv_list_ = [cctv for cctv in cctvList if cctv.get('roi_polygon')]  # Filter CCTV with ROI
    while True:
        dt = datetime.now()
        timestamp = dt.strftime("%Y-%m-%d_%H-%M-%S")
        ts = dt.timestamp()

        threads = []
        for i, cctv in enumerate(cctv_list_):
            thread = threading.Thread(target=capture_cctv, args=(timestamp, cctv, i))
            thread.start()
            threads.append(thread)

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        # Get the latest data
        get_latest_cctv_data(ts, timestamp)

        time.sleep(threadDelay)  # Delay before the next run


# Function to start the background thread
def start_background_thread():
    thread = threading.Thread(target=periodic_task)
    thread.daemon = True  # Daemonize thread to stop with the app
    thread.start()


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/cctv-list')
def cctv_list():
    return cctvList


@app.route('/cctv-latest')
def cctv_latest():
    return cctvLatestData


@app.route('/streams/images/<path:filename>')
def serve_file(filename):
    return send_from_directory("streams/images", filename)


# Define the route to get data by string ID
@app.route('/cctv-history/<string:no>', methods=['GET'])
def get_data(no):
    # Retrieve data for the given NO
    db_ = LocalDB()
    db_.open_db()
    history_ = db_.get_cctv_history(no)
    db_.close_db()

    if history_:
        return jsonify({"no": no, "data": history_}), 200
    else:
        return jsonify({"no": no, "data": []}), 404


# ------------------------------------------------------------------------------
# Run the application
# ------------------------------------------------------------------------------
# Run the background task when the app starts
with app.app_context():
    start_background_thread()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
