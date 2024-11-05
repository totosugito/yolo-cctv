import json
import os
import threading
import time
from datetime import datetime

import cv2
from flask import Flask, send_from_directory
from ultralytics import YOLO
from collections import Counter
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Disable CORS for all routes


def read_cctv_list():
    # Open and read the JSON file
    with open('static/cctv-bandung.json', 'r') as file:
        data_ = json.load(file)
    return data_


# --------- CONFIGURATION ---------
cctvId = [2, 15]  # run cctv from index FROM to index TO
threadDelay = 60  # delay in second
streamDir = './streams/'  # output directory for the streamed images and data
jpegQuality = 50  # JPEG quality for saving images
yoloModelPath = "./static/yolo11n.pt"  # path to the YOLO model

# --------- INITIALIZE ---------
cctvList = read_cctv_list()  # get all cctv data
yoloObjClass = {2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck'}  # object classes to track
trackingClassId = list(yoloObjClass.keys())  # list of class IDs to track
yoloModel = YOLO(yoloModelPath)  # load the YOLO model
cctvLatestData = []


def capture_cctv(timestamp, cctv, thread_id):
    cctv_url = cctv['stream_cctv']
    cctv_no = cctv['no']
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
    if results is None:
        print(f"No objects detected in frame for URL {cctv_url}")
        cap.release()
        return

    cap.release()

    data_count_ = {yoloObjClass[k]: v for k, v in Counter(results[0].boxes.cls.tolist()).items() if k in yoloObjClass}
    results_ = {
        "cls": results[0].boxes.cls.tolist(),
        "conf": results[0].boxes.conf.tolist(),
        "count": data_count_,
        "total": sum(data_count_.values())
    }

    # Plot the results
    frame = results[0].plot()

    # Save the frame as an image
    filename = os.path.join(streamDir, "images/", f"{cctv_no}_{timestamp}.jpg")  # Generate timestamp-based filename
    cv2.imwrite(filename, frame, [cv2.IMWRITE_JPEG_QUALITY, jpegQuality])

    # save the frame as a json file
    with open(os.path.join(streamDir, "data/", f"{cctv_no}_{timestamp}.json"), 'w') as file:
        json.dump(results_, file, indent=1)


def get_latest_cctv_data(timestamp):
    global cctvLatestData
    cctv_list_ = cctvList[cctvId[0]:cctvId[1]]

    results_ = {
        "timestamp": timestamp,
        "data": []
    }
    tmp_data = []
    for i in range(len(cctv_list_)):
        cctv = cctv_list_[i]
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
    cctvLatestData = results_


def periodic_task():
    cctv_list_ = cctvList[cctvId[0]:cctvId[1]]
    while True:
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        threads = []
        for i, cctv in enumerate(cctv_list_):
            thread = threading.Thread(target=capture_cctv, args=(timestamp, cctv, i))
            thread.start()
            threads.append(thread)

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        # get the latest data
        get_latest_cctv_data(timestamp)

        time.sleep(threadDelay)  # You can replace this line with any code you need to run periodically


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
    return cctvList[cctvId[0]:cctvId[1]]


@app.route('/cctv-latest')
def cctv_latest():
    return cctvLatestData


@app.route('/streams/images/<path:filename>')
def serve_file(filename):
    return send_from_directory("streams/images", filename)


# ------------------------------------------------------------------------------
# Run the application
# ------------------------------------------------------------------------------
# Run the background task when the app starts
with app.app_context():
    start_background_thread()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
