import json

from local_db import LocalDB


def read_cctv_list():
    # Open and read the JSON file
    with open('static/cctv-bandung.json', 'r') as file:
        data_ = json.load(file)
    return data_


allCCTVs = read_cctv_list()  # get all cctv data
db = LocalDB()
db.open_db()
db.add_cctv(allCCTVs)
db.close_db()
