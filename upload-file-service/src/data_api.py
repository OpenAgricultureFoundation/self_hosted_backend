from flask import Blueprint, g, jsonify, current_app
from influxdb import InfluxDBClient

data_api = Blueprint('data_api',__name__)


def get_influx():
    if 'influx' not in g:
        g.influx = InfluxDBClient(host='nuc-server.local',port=8086)
        g.influx.switch_database('openag_local')
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
        dev_status = r[0]['status']
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
