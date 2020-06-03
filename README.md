# self_hosted_backend
Project for a docker-compose managed self hosted backend for PFC (openag-device-software based) machines

## Componenets
There are several components contained in the docker-compose setup

###  eclipse-mosquitto
The [Eclipse Mosquitto](https://mosquitto.org/) project is used as an MQTT broker. Devices will communicate with the broker. A separate 
python service parses and process the messages from the PFCs. Commands out to the PFCs are also sent via the MQTT broker.

### InfluxDB
[InfluxDB](https://www.influxdata.com/time-series-platform/) is a time-series database that holds all the telemetry sent from the PFCs (plus other time based data).

### Chronograf
[Chronograf](https://www.influxdata.com/time-series-platform/chronograf/) is a web based interface to Influx for administration as well as visualization/exploration of the data

### mqtt-service
A 'local' mode branch of the [OpenAg Mqtt Service](https://github.com/OpenAgricultureFoundation/mqtt-service/tree/local-mqtt) is used to parse the data coming in from the PFCs and inserts 
the data in the InfluxDB database.

### upload-file-service
The upload file service is a tiny alpine docker based image running a [Flask](https://flask.palletsprojects.com/en/1.1.x/) web application to handle uploading,
and downloading of images via http. This is the only non-mqtt based communication from a PFC. Note that this service
is completly contained in this project (i.e. not a seperate Github project), but it doesn't have to be run inside a docker-compose
setup as it is a very simple Flask application.

### DataAPI service
**TODO**: Need to set up the service to handle images being uploaded from the PFCs. Most likely this will be a
variant of the OpenAg DataAPI service, but it will have to be modified to use InfluxDB.

### Control UI
**TODO**: A UI to control/monitor all PFCs. This will start as the EDU UI most likely.

## First Start
**TODO**: Fill in more detail

 1. `docker-compose up` will build and start the docker instances. (First time may take a few moments)
 2. Create an `openag_local` database in InfluxDB via Chronograf
 3. Setup dashboards / document using Chronograf with PFC data
 
 ## PFC setup
 In order to use this backend with PFCs, you need to run a modified version of the [openag-device-software]() code.
 
 **TODO**: Upload the local PFC version of the code, and document how to use it

