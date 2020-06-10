import React from 'react';
import {Table} from 'reactstrap'
import moment from "moment";

function RecentDeviceView(props) {
    const {deviceData} = props;

    return(
        <Table>
            <thead>
            {"last_image" in deviceData ?
                (
                    <tr>
                        <td colSpan={2}><img src={deviceData.last_image.url} class="img-fluid"></img> </td>
                    </tr>
                ) :
                ("")}
            {"last_image" in deviceData ?
                (
                <tr>
                    <td colSpan={2}>Image Taken: {moment(deviceData.last_image.time).format("ddd, MMM Do YYYY, h:mm:ss a")}</td>
                </tr>
                ) :
                ("")}
            <tr>
                <th>Measurement</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(deviceData).filter(key => key != 'last_image').map((key) => {
                return (<tr value={key}><td>{key}</td><td>{deviceData[key]}</td></tr>)
            })}
            </tbody>
        </Table>
    )
}

export default RecentDeviceView;