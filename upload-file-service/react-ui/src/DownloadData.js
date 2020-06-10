import React, {useEffect, useState} from 'react';
import {Container, Form, FormGroup, Label, Input, Row, Col, Button} from 'reactstrap';
import DateTimePicker from 'react-datetime-picker';
import moment from "moment";
import 'react-calendar/dist/Calendar.css';

function DownloadData(props){
    const [deviceList, setDeviceList] = useState({device_ids: [], statuses: {}});
    const [deviceCheckboxes, setDeviceChecckboxes] = useState([]);
    const [submitDisabled, setSubmiteDisabled] = useState(false);
    const [loadCount, setLoadCount] = useState(0);
    const [startDate, setStartDate] = useState(moment().startOf('day').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate());
    const [downloadLink, setDownloadLink] = useState(null)

    useEffect(() => {
        fetch("/api/devices").then(res => res.json()).then((data) => {
            setDeviceList(data);
        });
    }, [loadCount]);

    useEffect(() => {
        var newCheckboxes = [];
        deviceList.device_ids.map((dev_id) => {
            newCheckboxes.push({'id': dev_id, 'checked': false});
        })
        setDeviceChecckboxes(newCheckboxes);
    }, [deviceList])

    const changeCheck = (evt => {
        var cloneDeviceCheckboxes = [...deviceCheckboxes];
        for (var i = 0; i < cloneDeviceCheckboxes.length; i++){
            if (cloneDeviceCheckboxes[i].id === evt.target.id){
                cloneDeviceCheckboxes[i].checked = evt.target.checked;
            }
        }
        setDeviceChecckboxes(cloneDeviceCheckboxes);
    })


    const submitData = (evt) => {
        evt.preventDefault();
        setDownloadLink(null);
        setSubmiteDisabled(true);
        const selectedDevices = deviceCheckboxes.filter(dev => {return dev.checked}).map(dev => {
            return dev.id;
        });
        const data = JSON.stringify({"devices": selectedDevices,
                        "startDatetime": moment(startDate),
                        "endDatetime": moment(endDate)})
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: data };
        fetch('/api/downloadData', requestOptions)
            .then(response => response.json())
            .then(data => {setDownloadLink(data.url); setSubmiteDisabled(false)});
    }

    return (
        <Container>
            <Row>
                <Col><h4>Download data as CSV</h4></Col>
            </Row>
            <Row className={"mb-4"}>
                <Col>Configure data download by selecting devices to include, and start and end times</Col>
            </Row>
            <Row className={"mb-4"}>
                <Col>You can also use <a href={"http://" + window.location.hostname + ":8888/"}>Chronograph</a> to explore and download data.</Col>
            </Row>
            <Row>
                {downloadLink? (
                    <Col><h6><a href={downloadLink} target={"_blank"}>Click here to download your data</a></h6></Col>
                ): (<Col></Col>)}
            </Row>
            <Form onSubmit={submitData} >
            <Row>
                <Col><h5>Select Machines to include in download</h5></Col>
                <Col><h5>Select Start Date and Time</h5></Col>
            </Row>
            <Row>
                <Col>
                        {deviceCheckboxes.map(dev => {
                            return (<Row key={dev}>
                                        <Col>
                                            <FormGroup>
                                                <Label>
                                                    <Input type={"checkbox"}
                                                           name={"selectedDevices"}
                                                           id={dev.id}
                                                           checked={dev.checked}
                                                           onChange={changeCheck}></Input>
                                                {dev.id} ({deviceList.statuses[dev.id].serial_number})</Label>
                                            </FormGroup>
                                        </Col>
                                    </Row>)
                        })}
                </Col>
                <Col>
                    <Row><Col>
                        <DateTimePicker value={startDate} onChange={setStartDate}/>
                    </Col></Row>
                    <Row>
                        <Col><Input type={'hidden'} id={'startTime'} name={'startTime'} value={startDate}/></Col>
                    </Row>
                    <Row className={'mt-2'}><Col><h5>Select End Date and Time</h5></Col></Row>
                    <Row><Col>
                        <DateTimePicker value={endDate} onChange={setEndDate}/>
                    </Col></Row>
                    <Row>
                        <Col><Input type={'hidden'} id={'endTime'} name={'endTime'} value={endDate}/></Col>
                    </Row>
                    <Row className={'mt-4'}>
                        <Col><Button color={"primary"} disabled={submitDisabled}>Download Data</Button></Col>
                    </Row>
                </Col>
            </Row>
            </Form>
        </Container>)
}

export default DownloadData