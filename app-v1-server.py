import json
from flask import Flask, send_from_directory, jsonify
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

# --------- INITIALIZE ---------
allCCTVs = read_cctv_list()  # get all cctv data
cctvIndex = [i for i in range(len(allCCTVs))]  # get all cctv data
cctvList_ = [allCCTVs[i] for i in cctvIndex]
cctvList_ = [cctv for cctv in cctvList_ if cctv.get('roi_polygon')]
cctvList = [{key: value for key, value in item.items() if key != "roi_polygon"} for item in cctvList_]


@app.route('/')
def hello_world():  # put application's code here
    return 'App V1 Server is running!'


@app.route('/cctv-list')
def cctv_list():
    return cctvList


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

    result = [item for item in cctvList if item["no"] == no]
    cctv_ = result[0] if result else None

    if history_:
        return jsonify({"cctv": cctv_, "data": history_}), 200
    else:
        return jsonify({"cctv": cctv_, "data": []}), 404


@app.route('/cctv-latest')
def cctv_latest():
    db_ = LocalDB()
    db_.open_db()
    latest_data = db_.get_cctv_latest()
    db_.close_db()

    last_update = ""
    if len(latest_data) > 0:
        last_update = latest_data[0]["lastUpdated"]

    return jsonify({"timestamp": last_update, "data": latest_data}), 200


# ------------------------------------------------------------------------------
# Run the application
# ------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
