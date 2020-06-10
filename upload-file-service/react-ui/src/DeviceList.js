import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, ModalHeader, ModalBody, Navbar, NavbarBrand, Row} from 'reactstrap';
import moment from 'moment';
import RecentDeviceView from "./components/RecentDeviceView";

function DeviceList() {
    const [deviceList, setDeviceList] = useState({device_ids: [], statuses: {}});
    const [loadCount, setLoadCount] = useState(0);
    const [fetchDevice, setFetchDevice] = useState("");
    const [deviceLoadCount, setDeviceLoadCount] = useState(0);
    const [deviceData, setDeviceData] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (fetchDevice.trim().length != 0){
            fetch("/api/lastSensorReadings/" + fetchDevice.trim())
                .then(res => res.json())
                .then((data) => {setDeviceData(data)});
        }
    }, [fetchDevice, deviceLoadCount])

    useEffect(() => {
        fetch("/api/devices").then(res => res.json()).then((data) => {
            setDeviceList(data);
        });
    }, [loadCount]);

    const refreshData = () => {setLoadCount(loadCount + 1);}

    const toggle = (evt) => {
        if(modal) {
            // if the modal is open, just close it
            setModal(false);
        } else {
            setDeviceData(null);
            setModal(true);
            let device_id = evt.target.value;
            if (fetchDevice === device_id) {
                setDeviceLoadCount(deviceLoadCount + 1);
            } else {
                setFetchDevice(device_id);
            }
        }
    }

    return (
        <div>
            <Container >
                <Row>
                    <Col><h4>PFC Device List</h4></Col>
                </Row>
                <Row>
                    <Col md={{offset: 1}}>
                        <p>Below is a list of devices seen by the backend, along with status information</p>
                    </Col>
                </Row>
                <Row className={'mb-4'}>
                    <Col sm={{size: '4'}}><h5>Device ID (click to connect)</h5></Col>
                    <Col sm={{size: '2'}}><h5>S/N</h5></Col>
                    <Col sm={{size: '4'}}><h5>Last Status</h5></Col>
                    <Col sm={{size: '2'}}><Button onClick={refreshData} color="primary" size="sm">Refresh List</Button></Col>
                </Row>
                {
                    deviceList.device_ids.map((value, index) => {
                        var device_status = deviceList.statuses[value];
                        return (
                            <Row key={index}>
                                <Col sm={{size: '4'}}><p><a href={"http://" + device_status.IP}>{value}</a></p></Col>
                                <Col sm={{size: '2'}}>{device_status.serial_number}</Col>
                                <Col sm={{size: '4'}}><p>{moment(device_status.timestamp).format("ddd, MMM Do YYYY, h:mm:ss a")}</p></Col>
                                <Col sm={{size: '2'}}><Button size={"sm"} value={value} onClick={toggle}>View Latest</Button></Col>
                            </Row>
                        );
                    })}
            </Container>
            <Modal isOpen={modal} toggle={toggle} size={"lg"}>
                <ModalHeader toggle={toggle}>{fetchDevice} Latest Data</ModalHeader>
                <ModalBody>
                    {deviceData ? (
                        <RecentDeviceView deviceData={deviceData} />
                    ) : (<h6>Loading...</h6>)}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default DeviceList;
