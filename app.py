import json
import os
import threading
import time
from datetime import datetime

import cv2
from flask import Flask

app = Flask(__name__)


def read_cctv_list():
    data_ = []
    # Open and read the JSON file
    with open('static/cctv-bandung.json', 'r') as file:
        data_ = json.load(file)
    return data_


cctvList = read_cctv_list()
cctvId = [0, 5]
threadDelay = 20
streamDir = './streams/'


def capture_cctv(cctv, thread_id):
    cctv_url = cctv['stream_cctv']
    cctv_no = cctv['no']
    cap = cv2.VideoCapture(cctv_url)

    if not cap.isOpened():
        print(f"Error: Could not open video stream for URL {cctv_url}")
        return

    print(f"Starting capture on thread {thread_id} for URL: {cctv_url}")

    success, frame = cap.read()
    if not success:
        print(f"End of stream or error fetching frame for URL {cctv_url}")
        return

    # Generate timestamp-based filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S%f")
    filename = os.path.join(streamDir, f"{cctv_no}_{timestamp}.jpg")

    # Save the frame as an image
    cv2.imwrite(filename, frame)
    cap.release()


def periodic_task():
    cctv_list_ = cctvList[cctvId[0]:cctvId[1]]
    while True:
        threads = []
        for i, cctv in enumerate(cctv_list_):
            thread = threading.Thread(target=capture_cctv, args=(cctv, i))
            thread.start()
            threads.append(thread)

        # Wait for all threads to complete
        for thread in threads:
            thread.join()
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


# ------------------------------------------------------------------------------
# Run the application
# ------------------------------------------------------------------------------
# Run the background task when the app starts
with app.app_context():
    start_background_thread()

if __name__ == '__main__':
    app.run()
