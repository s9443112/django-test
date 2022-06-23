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
    Progress
} from "reactstrap";

import mqtt from 'mqtt';

var options = {
    username: 'iii',
    password: 'iii05076416',
    port: 8087,
}
// var client = mqtt.connect('ws://139.162.96.124', options)

export default class DashboardDispatch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: []
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
            let { Devices, dispatch } = this.state
            let data = message.toString()
            console.log(data)
            let buffer
            if (topic === 'fucker') {
                try {
                    data = JSON.parse(data)
                    console.log(data)
                    // console.log(Devices)

                    let deviceIndex = Devices.findIndex(ele => ele.client_id === data["deviceID"])
                    // console.log(deviceIndex)
                    if (deviceIndex === -1) {
                        // console.log(-1)
                        return
                    }
                    // console.log(data.data)
                    Devices[deviceIndex]['count'] = data.data
                    Devices[deviceIndex]['status'] = true

                    this.setState({ Devices: Devices })
                    // co
                    // console.log(Devices[deviceIndex])
                    // console.log(dispatch)

                    for (let i = 0; i <= dispatch.length; i++) {
                        if (dispatch[i] === undefined) {
                            break
                        }
                        // console.log(dispatch[i])

                        buffer = dispatch[i].device.find(elee => elee.client_id === data["deviceID"])
                        console.log(buffer)


                        if (buffer !== undefined) {
                            // console.log(buffer)
                            // console.log(dispatch[i])
                            dispatch[i].real_count = dispatch[i].real_count + 1
                            break
                        }
                    }

                    this.setState({ dispatch: dispatch })




                } catch (err) {
                    console.log(err)
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


    compare_client_id = (a, b) => {
        if (a.client_id < b.client_id) {
            return -1;
        }
        if (a.client_id > b.client_id) {
            return 1;
        }
        return 0;
    }

    compare_date_time = (a, b) => {
        if (a.guess_end_date < b.guess_end_date) {
            return -1;
        }
        if (a.guess_end_date > b.guess_end_date) {
            return 1;
        }
        return 0;
    }

    do_something = async () => {

        let dispatch = await request.get_dispatch_by_status(1)
        dispatch.sort(this.compare_date_time)
        // console.log(dispatch)


        let devices = await request.get_devices()
        devices.sort(this.compare_client_id)

        let users = await request.get_users()
        let index
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
        let buffer
        devices.map((ele) => {
            // console.log(ele)
            index = users.find(elee => elee.id === ele.user)
            ele["user_info"] = index
            buffer = dispatch.findIndex(elee => elee.dispatchNumber === ele.dispatch_first)
            if (buffer != -1) {

                if (dispatch[buffer]["device"] === undefined) {
                    dispatch[buffer]["device"] = []
                }
                dispatch[buffer]["device"].push(ele)
                // dispatch[buffer]["real_count"] = dispatch[buffer]["real_count"] + ele.count
                // console.log(dispatch[buffer]["real_count"])
            }

        })




        this.setState({ Devices: devices })
        this.setState({ dispatch: dispatch })



    }

    async componentDidMount() {
        await this.connect()
        await this.do_something()
    }

    render() {
        let { dispatch } = this.state
        // console.log(dispatch)
        return (
            <div className="content">

                <Row>

                    {dispatch.map((ele, d) => {
                        // console.log(ele["device"])
                        return (
                            <Col lg="6" md="6" key={`device key ${d}`}>
                                <Card className="card-stats" style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardBody>
                                        <Row>

                                            <Col md="10">
                                                <h2 style={{ textAlign: 'left' }}>工單號碼: {ele.dispatchNumber} / 品名: {ele.product_name}</h2>

                                            </Col>
                                            <Col md="2">
                                                <CardTitle style={{ textAlign: 'right' }} tag="h3">{ele.real_count} / {ele.qt_count}</CardTitle>
                                            </Col>


                                            <Col md="12">
                                                <Row>
                                                    {ele["device"] !== undefined && ele.device.map((elee, dd) => {
                                                        // console.log(elee)
                                                        return (
                                                            <Col lg="4" md="6" key={`device key ${dd}`}>
                                                                <Card className="card-stats" onClick={() => window.location.href = `/admin/virtual_device?id=${elee.id}`} style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }} >
                                                                    <CardBody>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                {elee.status === true ? <img src={`${process.env.PUBLIC_URL}/static/Green_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img> :
                                                                                    <img src={`${process.env.PUBLIC_URL}/static/Red_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img>}
                                                                                {/* <div className={`info-icon text-center icon-${elee.status === true ? 'success' : 'warning'}`}>
                                                                                    <i className="tim-icons icon-heart-2" />
                                                                                </div> */}
                                                                                {/* <CardTitle tag="h3">Device: {ele.name}</CardTitle> */}
                                                                            </Col>
                                                                            <Col xs="8">
                                                                                <div className="numbers">
                                                                                    <CardTitle tag="h2">{elee.name} / {elee.user_info.name} </CardTitle>
                                                                                    <CardTitle tag="h3">{elee.count}</CardTitle>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardBody>

                                                                </Card>
                                                            </Col>
                                                        )
                                                    })}
                                                </Row>
                                            </Col>
                                            <Col md="12">
                                                <div className="progress-container progress-primary">
                                                    <span style={{ fontSize: '22px' }} className="progress-badge">進度條</span>
                                                    <Progress max={ele.qt_count} value={ele.real_count}>
                                                        <span style={{ fontSize: '22px' }} className="progress-value">{(ele.real_count / ele.qt_count * 100).toFixed(2)}%</span>
                                                    </Progress>
                                                </div>
                                            </Col>
                                            <Col md="12">
                                                <h3>預計完工日: {moment(new Date(ele.guess_end_date)).format("YYYY-MM-DD")}</h3>
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

}