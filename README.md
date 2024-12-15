## Run the periodic task
pm2 start app-v1.py --interpreter python3 --name yolo-app-v1

## Run the server
pm2 start app-v1-server.py --interpreter python3 --name yolo-app-v1-server
or
gunicorn -w 1 -b 0.0.0.0:5001 app-v1-server:app
or
pm2 start "gunicorn -w 1 -b 0.0.0.0:5001 app-v1-server:app" --name yolo-app-v1-server

