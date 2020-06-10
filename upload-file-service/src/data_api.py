from flask import Blueprint, g, jsonify, current_app, request
from influxdb import InfluxDBClient
import pandas as pd
from zipfile import ZipFile
import uuid
import json
import time
import os, os.path

data_api = Blueprint('data_api',__name__)


def get_influx():
    if 'influx' not in g:
        g.influx = InfluxDBClient(host=current_app.config["INFLUX_HOST"],port=current_app.config["INFLUX_PORT"])
        g.influx.switch_database(current_app.config["INFLUX_DB"])
    return g.influx


def _get_last_env_vars(device_id):
    results = get_influx().query("SELECT LAST(*) FROM env_vars WHERE device_id = $device_id GROUP BY *::field",
                                 bind_params={'device_id': device_id})
    output = None
    for r in results:
        if output is None:
            output = r[0]
        else:
            for key in r[0].keys():
                if key != 'time' and r[0][key] is not None:
                    output[key] = r[0][key]
    if 'time' in output:
        del output['time']
    return output


def _get_last_image(device_id):
    results = get_influx().query("SELECT LAST(filename) AS filename FROM images WHERE device_id = $device_id",
                                 bind_params={'device_id': device_id})
    output = None
    for r in results:
        output = r[0]
    return output


@data_api.route('/api/devices', methods=["GET"])
def get_devices():
    '''Get a list of devices as json'''
    influx = get_influx()
    results = influx.query("SELECT last(status) as status, device_id FROM status GROUP BY device_id")
    response_obj = {
        'device_ids': [],
        'statuses': {}
    }
    for r in results:
        dev_id = r[0]['device_id']
        dev_status = json.loads(r[0]['status'])
        response_obj['device_ids'].append(dev_id)
        response_obj['statuses'][dev_id] = dev_status

    return jsonify(response_obj)


@data_api.route('/api/lastSensorReadings/<device_id>', methods=["GET"])
def get_last_sensor_readings(device_id):
    output = _get_last_env_vars(device_id)
    last_image = _get_last_image(device_id)
    if last_image is not None:
        last_image['url'] = "{}{}".format(current_app.config['IMAGES_URL'], last_image['filename'])
        output['last_image'] = last_image
    return jsonify(output)

@data_api.route('/api/downloadData', methods=["POST"])
def downloadData():
    req_data = request.get_json()
    print(req_data)
    devices = req_data["devices"]
    start = req_data["startDatetime"]
    end = req_data["endDatetime"]
    # Can't use bind params for the WHERE clause
    where_caluse = "WHERE time>=$startDate AND time<$endDate"
    params = {"startDate": start,
              "endDate": end}
    if(len(devices) > 0):
        devPlaceholders = []
        for i in range(len(devices)):
            devPlaceholders.append("device_id=$devid_"+str(i))
            params["devid_"+str(i)] = devices[i]
        devWhere = " AND ( " + " OR ".join(devPlaceholders) + " )"
        where_caluse = where_caluse + devWhere
    query = "select * from env_vars " + where_caluse + " ORDER BY time asc"
    results = get_influx().query(query, bind_params=params)
    df = pd.DataFrame(results.get_points())
    env_vars_filename = os.path.join(current_app.config['DATA_FOLDER'],"env_vars_"+start.replace(':','-').replace('.','-')+"_to_"+end.replace(':','-').replace('.','-')+".csv")
    df.to_csv(env_vars_filename)

    query = "select * from images " + where_caluse + " ORDER BY time asc"
    results = get_influx().query(query, bind_params=params)
    df = pd.DataFrame(results.get_points())
    images_filename = os.path.join(current_app.config['DATA_FOLDER'], "images_"+start.replace(':','-').replace('.','-')+"_to_"+end.replace(':','-').replace('.','-')+".csv")
    df.to_csv(images_filename)

    zipfilename = str(uuid.uuid4().hex) + ".zip"
    zf = ZipFile( os.path.join(current_app.config['DATA_FOLDER'],zipfilename), 'w')
    zf.write(env_vars_filename)
    zf.write(images_filename)
    zf.close()
    os.remove(env_vars_filename)
    os.remove(images_filename)
    return jsonify({"url":current_app.config['DATA_URL']+zipfilename})
