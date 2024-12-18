import json
import sqlite3


class LocalDB:
    conn = None
    db_path = None

    def __init__(self, db_path='./static/cctv-tracker.sqlite3'):
        self.db_path = db_path

    def open_db(self):
        self.conn = sqlite3.connect(self.db_path)

    def close_db(self):
        self.conn.close()

    def add_cctv(self, cctv_list):
        cursor = self.conn.cursor()

        # Prepare the data for insertion
        # Serialize the roi_polygon field as a JSON string
        data_to_insert = [
            {
                "no": item["no"],
                "cctv_name": item["cctv_name"],
                "lat": item["lat"],
                "lng": item["lng"],
                "stream_cctv": item["stream_cctv"],
                "roi_polygon": json.dumps(item.get("roi_polygon", []))  # Serialize nested data
            }
            for item in cctv_list
        ]

        # Insert data into the table
        print(f"Inserting {len(data_to_insert)} rows into table_cctv")
        cursor.executemany('''
        INSERT INTO table_cctv (no, cctv_name, lat, lng, stream_cctv, roi_polygon)
        VALUES (:no, :cctv_name, :lat, :lng, :stream_cctv, :roi_polygon)
        ''', data_to_insert)

        # Commit the transaction and close the connection
        self.conn.commit()


    def add_cctv_history(self, ts, timestamp, cctv_list):
        cursor = self.conn.cursor()
        for cctv in cctv_list:
            try:
                no = cctv.get('cctv', {}).get('no', '000')
                car = cctv.get('data', {}).get('count', {}).get('car', 0)
                truck = cctv.get('data', {}).get('count', {}).get('truck', 0)
                bus = cctv.get('data', {}).get('count', {}).get('bus', 0)
                motorcycle = cctv.get('data', {}).get('count', {}).get('motorcycle', 0)
                total = cctv.get('data', {}).get('total', 0)
                cursor.execute("INSERT INTO table_history (no, car, truck, bus, motorcycle, total, dt, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                               (no, car, truck, bus, motorcycle, total, int(ts), timestamp))
            except sqlite3.Error as e:
                print(f"An error occurred: {e}")

        self.conn.commit()

    def get_cctv_history(self, no):
        cursor = self.conn.cursor()
        try:
            cursor.execute("SELECT dt FROM table_history WHERE no = ? ORDER BY dt DESC LIMIT 1", (no,))
            # Fetch the result
            rows = cursor.fetchall()  # Use fetchone() if you expect only one row

            latest_dt = rows[0][0]
            last_dt = latest_dt - (30 * 24 * 60 * 60)  # a month ago

            cursor.execute("SELECT * FROM table_history WHERE ((no = ?) AND (dt > ?)) ", (no, last_dt))

            # Fetch the result
            rows = cursor.fetchall()  # Use fetchone() if you expect only one row

            # Get column names from the cursor
            column_names = [desc[0] for desc in cursor.description]

            # Specify the keys to include (e.g., first and third columns)
            keys_to_include = ['car', 'truck', 'bus', 'motorcycle', 'total', 'dt', 'lastUpdated']

            # Convert tuples to a list of filtered dictionaries
            result = [
                {key: row[column_names.index(key)] for key in keys_to_include if key in column_names}
                for row in rows
            ]

            if result:
                return result
            else:
                return []
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
            return []
        finally:
            cursor.close()

    def get_cctv_latest(self):
        cursor = self.conn.cursor()
        try:
            cursor.execute("SELECT dt FROM table_history ORDER BY dt DESC LIMIT 1")
            # Fetch the result
            rows = cursor.fetchall()  # Use fetchone() if you expect only one row

            latest_dt = rows[0][0]

            cursor.execute("SELECT table_history.*, table_cctv.* FROM table_history "
                           "INNER JOIN table_cctv ON table_history.no = table_cctv.no "
                           "WHERE dt = ? ORDER BY total DESC", (latest_dt,))

            # Fetch the result
            rows = cursor.fetchall()

            # Get column names from the cursor
            column_names = [desc[0] for desc in cursor.description]

            # Specify the keys to include (e.g., first and third columns)
            keys_to_include = ['no', 'car', 'truck', 'bus', 'motorcycle', 'total', 'dt', 'lastUpdated',
                               'cctv_name', 'lat', 'lng', 'stream_cctv']

            # Convert tuples to a list of filtered dictionaries
            result = [
                {key: row[column_names.index(key)] for key in keys_to_include if key in column_names}
                for row in rows
            ]

            if result:
                return result
            else:
                return []
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
            return []
        finally:
            cursor.close()

