import React, { forwardRef, useState, useEffect, useRef } from 'react';

import * as request from '../../request/index'

import moment from 'moment'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Container,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    UncontrolledAlert
} from "reactstrap";

import mqtt from 'mqtt';
var options = {
    username: 'iii',
    password: 'iii05076416',
    port: 8087,
    // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    // keepalive: 60
}
var client = mqtt.connect('ws://139.162.96.124', options)


export default function Dashboard() {
    
    // const [value, setValue] = useState('');
    const [Devices, setDevices] = React.useState([])
    const DevicesRef = useRef([]);
    // const [client, setClient] = useState(null);
    client.on('connect', function () {
        // alert('sussess asshole')
        client.subscribe('fucker')
    })


    client.on('message', async function (topic, message) {

        // if(buffer.current === false){
        //     console.log("???")
        //     buffer.current = true
        //     return 
        // }
        let data = message.toString()

        try {
            data = JSON.parse(data)
            console.log(data)
            console.log(DevicesRef.current)

            let deviceIndex = DevicesRef.current.findIndex(ele => ele.client_id === data["deviceID"])
            console.log(deviceIndex)
            if (deviceIndex === -1) {
                // console.log(-1)
                return
            }
            console.log(data.data)
            DevicesRef.current[deviceIndex]['count'] = data.data
           
            console.log(DevicesRef.current)
            setDevices(DevicesRef.current)

        } catch {

        }




    })


    client.on('offline', function () {
        console.error('mqtt出错 offline：')
        client.end()
        client.reconnect()      // 断开连接再次重连
    });

    client.on('reconnect', function () {
        client.subscribe('fucker')
    });

    client.on('error', err => {
        console.error('mqtt出错：', err)
        client.end()
        client.reconnect()      // 断开连接再次重连
    })
   
    useEffect(async () => {
        // alert("fuck")
        
        let devices = await request.get_devices()

        let result = await Promise.all(devices.map((ele) => {
            return request.get_last_device_count(ele.id)
        }))


        result.map((ele, d) => {
            // console.log(ele)
            if (ele.length === 0) {
                devices[d]["count"] = 0
            } else {
                devices[d]["count"] = ele[0].count
            }


        })
        // console.log(devices)
        DevicesRef.current = devices
        setDevices(DevicesRef.current)

        
        
    }, [])

    

    return (
        <div className="content">
            
            <Row>

                {Devices.map((ele, d) => {
                    return (
                        <Col lg="3" md="6" key={`device key ${d}`}>
                            <Card className="card-stats">
                                <CardBody>
                                    <Row>
                                        <Col xs="5">
                                            <div className="info-icon text-center icon-warning">
                                                <i className="tim-icons icon-shape-star" />
                                            </div>
                                            {/* <CardTitle tag="h3">Device: {ele.name}</CardTitle> */}
                                        </Col>
                                        <Col xs="7">
                                            <div className="numbers">
                                                <p className="card-category">{ele.name}</p>
                                                <CardTitle tag="h3">{ele.count}</CardTitle>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>

                            </Card>
                        </Col>
                    )
                })}

            </Row>
        </div>
    )
}