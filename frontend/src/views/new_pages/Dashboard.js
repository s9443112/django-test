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
}
// var client = mqtt.connect('ws://139.162.96.124', options)

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Devices: []
        }
    }
    connect() {

        this.client = mqtt.connect('ws://139.162.96.124', options)
        this.client.on("connect", () => {
            this.client.subscribe('fucker')
            this.client.subscribe('online')
            this.client.subscribe('web_reset')
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
            let { Devices } = this.state
            let data = message.toString()
            if (topic === 'fucker') {
                try {
                    data = JSON.parse(data)
                    console.log(data)
                    console.log(Devices)

                    let deviceIndex = Devices.findIndex(ele => ele.client_id === data["deviceID"])
                    console.log(deviceIndex)
                    if (deviceIndex === -1) {
                        // console.log(-1)
                        return
                    }
                    console.log(data.data)
                    Devices[deviceIndex]['count'] = data.data
                    Devices[deviceIndex]['status'] = true

                    this.setState({ Devices: Devices })

                } catch {

                }
            }
            if (topic === 'online') {
                try {
                    data = JSON.parse(data)
                    console.log(data)
                    console.log(Devices)

                    let deviceIndex = Devices.findIndex(ele => ele.client_id === data["deviceID"])
                    console.log(deviceIndex)
                    if (deviceIndex === -1) {
                        // console.log(-1)
                        return
                    }
                    Devices[deviceIndex]['status'] = (data.msg === 'on' ? true : false)
                    this.setState({ Devices: Devices })
                } catch {

                }

            }
            if (topic === 'web_reset') {
                await this.do_something()
            }




        });
    }

    compare_datetime = (a, b) => {
        if (a.client_id < b.client_id) {
            return -1;
        }
        if (a.client_id > b.client_id) {
            return 1;
        }
        return 0;
    }


    do_something = async () => {

        let devices = await request.get_devices()

        devices.sort(this.compare_datetime)


        let users = await request.get_users()
        console.log(users)

        let index 
        devices.map((ele)=>{
            // console.log(ele.user)
            index = users.find(elee=>elee.id === ele.user)
            // console.log(index)
            ele["user_info"] = index
        })
        console.log(devices)

        // let result = await Promise.all(devices.map((ele) => {
        //     return request.get_last_device_count(ele.id)
        // }))


        // result.map((ele, d) => {
        //     // console.log(ele)
        //     if (ele.length === 0) {
        //         devices[d]["count"] = 0
        //     } else {
        //         devices[d]["count"] = ele[0].count
        //     }


        // })
        this.setState({ Devices: devices })
    }

    async componentDidMount() {
        await this.connect()
        await this.do_something()
    }

    playMusic = () => {
        var music = new Audio(`${process.env.PUBLIC_URL}/static/test.mp3`);
        music.play();
    }

    render() {
        let { Devices } = this.state
        return (
            <div className="content">
                <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                    <CardHeader>
                        <CardTitle tag="h2">計數器生產資訊</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>

                            {Devices.map((ele, d) => {
                                return (
                                    <Col lg="3" md="6" key={`device key ${d}`}>
                                        <Card onClick={() => window.location.href = `/admin/virtual_device?id=${ele.id}`}  className="card-stats" style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }}>
                                            <CardBody>
                                                <Row>
                                                    <Col xs="5">

                                                        {ele.status === true ? <img src={`${process.env.PUBLIC_URL}/static/Green_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img> :
                                                            <img src={`${process.env.PUBLIC_URL}/static/Red_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img>}

                                                    </Col>
                                                    <Col xs="7">
                                                        <div className="numbers">
                                                            <CardTitle tag="h2">{ele.name} / {ele.user_info.name}</CardTitle>
                                                            <CardTitle tag="h3">{ele.count}</CardTitle>
                                                            {/* <p>{ele.name}</p> */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                            

                                        </Card>

                                        {/* <Card onClick={() => window.location.href = `/admin/virtual_device?id=${ele.id}`} className="card-stats"
                                            style={{
                                                backgroundColor: '#774e94',
                                                WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))",
                                                filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))",

                                            }}>
                                            <CardBody>
                                                <Row>
                                                    <Col xs="6">

                                                        <CardTitle tag="h2">{ele.name}</CardTitle>
                                                        <CardTitle tag="h2">{ele.count}</CardTitle>
                                                    </Col>
                                                    <Col xs="6">
                                                        <img src={`${process.env.PUBLIC_URL}/static/Green_Light_Icon.svg`} alt="logo" style={{ width: 40 }}></img>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card> */}
                                    </Col>
                                )
                            })}

                        </Row>

                    </CardBody>
                </Card>
            </div>
        )

    }

}