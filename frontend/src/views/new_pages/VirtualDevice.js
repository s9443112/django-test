import React, { forwardRef, useState, useEffect, useRef } from 'react';

import * as request from '../../request/index'
import DigitalNumber from '../../dist/react-digital-number/dist/DigitalNumber'
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
}
// var client = mqtt.connect('ws://139.162.96.124', options)

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    connect() {

        this.client = mqtt.connect('ws://139.162.96.124', options)
        this.client.on("connect", () => {
            console.log('connect')
        });
        this.client.on("disconnect", () => {
            console.log("disconnect");
        });
        this.client.on("reconnect", () => {
            console.log("reconnect");
        });
        this.client.on("offline", () => {
            console.log("offline");
        });
        this.client.on("close", () => {
            console.log("close");
        });
        this.client.on("error", err => {
            console.log("Ooops", "Something is wrong!", err);
        });

        this.client.on("message", async (topic, message) => {
            let { device } = this.state
            let data = message.toString()
            console.log(data)
            if (topic === device.client_id) {
                if (data === '99999') {

                    window.alert('設備工單已更動 請注意')
                    let buf_device = await request.get_devices_by_id(device.id)
                    console.log(buf_device)
                    this.setState({ device: buf_device })
                } else {
                    device.count = data
                    this.setState({ device: device })
                }

            }


        });
    }


    getParameterByName = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };




    pad = (num, size) => {
        var s = "0000" + num;
        return s.substring(s.length - size);
    }


    componentWillUnmount() {
        this.client.end()
    }

    async componentDidMount() {

        let id = this.getParameterByName("id")

        let device = await request.get_devices_by_id(id)
        if (device["type"] !== undefined) {
            window.alert("設備不存在")
            setTimeout(function () { window.location.href = '/admin/dashboard_dispatch' }, 500);
            return
        }


        this.setState({ device: device })

        options["clientId"] = `mqttjs_${device.client_id}`


        await this.connect()

        this.client.subscribe(device.client_id)
        this.client.subscribe(`${device.client_id}_dispatch`)
        console.log(`${device.clientId}_dispatch`)
        console.log(device)
    }

    _handleKeyDown = (e) => {
        let { device } = this.state
        if (e.key === 'Enter') {
            this.client.publish('fucker', `{"deviceID":"${device.client_id}","data":${device.count},"method":"+1"}`)
        }
    }


    render() {
        let { device } = this.state
        return (
            <>
                {device !== undefined &&
                    <div className="content">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2"> 設備名稱: {device.name} / 設備ID: {device.client_id}</CardTitle>
                                <CardTitle tag="h2"> {device.dispatch_first === null ? '未派工' : `工單編號: ${device.dispatch_first}`}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                        <DigitalNumber
                                            nums={`${this.pad(device.count, 5)}`}  // nums is the number your wanna show (defualt '123'
                                            color={'red'} // the active line color of number
                                            unActiveColor='#22221e' // the unactive line color of number
                                            backgroundColor='#000' // digital number container's background color
                                            transform
                                            transformDuration={600}
                                        />
                                    </Col>
                                    <Col md={12} className="ml-auto mr-auto">
                                        <div >
                                            <Button onKeyDown={this._handleKeyDown} block color="info" size="lg" onClick={() => this.client.publish('fucker', `{"deviceID":"${device.client_id}","data":${device.count},"method":"+1"}`)}>新增</Button>
                                        </div>
                                    </Col>
                                </Row>



                            </CardBody>
                        </Card>
                    </div>
                }
            </>
        )

    }

}