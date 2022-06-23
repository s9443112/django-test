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
    Collapse,
    Row,
    Col,
    Progress,
    Table
} from "reactstrap";

import mqtt from 'mqtt';

var options = {
    username: 'iii',
    password: 'iii05076416',
    port: 8087,
}
// var client = mqtt.connect('ws://139.162.96.124', options)

export default class OverviewDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: []
        }
    }



    do_something = async () => {
        let data = await request.get_all_devicedispatch()
        data.sort(this.compare_date_time)
        data = await this.make_date_json(data)
        console.log(data)
        this.setState({ history_dispatch: data })

        let all_dispatch_not_start = await request.get_dispatch_by_status(0)
        this.setState({ all_dispatch_not_start: all_dispatch_not_start })
       

        let all_working_dispatch = await request.get_dispatch_by_status(1)
        console.log(all_working_dispatch)
        // this.setState({ })

        let devices = await request.get_devices()
        devices.sort(this.compare_client_id)

        let buffer
        devices.map((ele) => {
            // console.log(ele)
            buffer = all_working_dispatch.findIndex(elee => elee.dispatchNumber === ele.dispatch_first)
            if (buffer != -1) {

                if (all_working_dispatch[buffer]["device"] === undefined) {
                    all_working_dispatch[buffer]["device"] = []
                }
                all_working_dispatch[buffer]["device"].push(ele)

            }

        })


        let finish_working_dispatch = await request.get_dispatch_by_status(2)

        let today_finish = []
        finish_working_dispatch.map((ele) => {
            if (moment(ele.real_end_date).format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD")) {
                today_finish.push(ele)
            }
        })
        this.setState({ finish_working_dispatch: today_finish, all_working_dispatch: all_working_dispatch, devices: devices })


    }

    connect() {

        this.client = mqtt.connect('ws://139.162.96.124', options)
        this.client.on("connect", () => {
            this.client.subscribe('fucker')
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
            let { devices, all_working_dispatch } = this.state
            let data = message.toString()
            console.log(data)
            let buffer
            if (topic === 'fucker') {
                try {
                    data = JSON.parse(data)
                    console.log(data)
                    // console.log(Devices)

                    let deviceIndex = devices.findIndex(ele => ele.client_id === data["deviceID"])
                    // console.log(deviceIndex)
                    if (deviceIndex === -1) {
                        // console.log(-1)
                        return
                    }
                    // console.log(data.data)
                    devices[deviceIndex]['count'] = data.data
                    devices[deviceIndex]['status'] = true

                    this.setState({ devices: devices })
                    // co
                    // console.log(Devices[deviceIndex])
                    // console.log(dispatch)

                    for (let i = 0; i <= all_working_dispatch.length; i++) {
                        if (all_working_dispatch[i] === undefined) {
                            break
                        }
                        // console.log(dispatch[i])

                        buffer = all_working_dispatch[i].device.find(elee => elee.client_id === data["deviceID"])
                        console.log(buffer)


                        if (buffer !== undefined) {
                            // console.log(buffer)
                            // console.log(dispatch[i])
                            all_working_dispatch[i].real_count = all_working_dispatch[i].real_count + 1
                            break
                        }
                    }

                    this.setState({ all_working_dispatch: all_working_dispatch })




                } catch (err) {
                    console.log(err)
                }
            }

            if (topic === 'web_reset') {
                await this.do_something()
            }




        });
    }

    async componentDidMount() {
        await this.do_something()
        await this.connect()
    }

    compare_date_time = (a, b) => {
        if (a.date_time > b.date_time) {
            return -1;
        }
        if (a.date_time < b.date_time) {
            return 1;
        }
        return 0;
    }

    make_date_json = async (resulter) => {
        
        let result = JSON.parse(JSON.stringify(resulter))
        // console.log(result)
        let obj_data = {}
        let check
        let last_day
        result.map((ele) => {


            if (obj_data[moment(ele.date_time).format("YYYY-MM-DD")] === undefined) {
                obj_data[moment(ele.date_time).format("YYYY-MM-DD")] = []
            }
            ele.date_time = moment(ele.date_time).format("YYYY-MM-DD")
            // console.log(ele)
           

            check = obj_data[moment(ele.date_time).format("YYYY-MM-DD")].find(elee => elee.dispatchNumber === ele.dispatchNumber)
            if (check !== undefined) {
                check.count = check.count + ele.count
            } else {
                obj_data[moment(ele.date_time).format("YYYY-MM-DD")].push(ele)
            }




        })
        // console.log(obj_data)
        return obj_data

    }

    uniqByKeepFirst = (a, key) => {
        let seen = new Set();
        return a.filter(item => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }


    render() {
        let { history_dispatch, all_dispatch_not_start, all_working_dispatch, finish_working_dispatch } = this.state
        // console.log(dispatch)
        return (
            <div className="content">

                <Row>


                    <Col lg="3" md="3">
                        <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                            <CardHeader>
                                <CardTitle tag="h4">每日工單生產紀錄</CardTitle>
                            </CardHeader>

                            <CardBody>


                                <div
                                    aria-multiselectable={true}
                                    className="card-collapse"
                                    id="accordion"
                                    role="tablist"
                                >
                                    {history_dispatch !== undefined && Object.keys(history_dispatch).map((ele) => {
                                        return (
                                            <Card className="card-plain" key={`date ${ele}`}>
                                                <CardHeader role="tab">
                                                    <a
                                                        aria-expanded={this.state[ele]}
                                                        href="#pablo"
                                                        data-parent="#accordion"
                                                        data-toggle="collapse"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            let buffer = {}
                                                            buffer[ele] = !this.state[ele]
                                                            this.setState(buffer);
                                                        }}
                                                    >
                                                        {ele}{" "}
                                                        <i className="tim-icons icon-minimal-down" />
                                                    </a>
                                                </CardHeader>
                                                <Collapse role="tabpanel" isOpen={this.state[ele]}>
                                                    <CardBody>
                                                        <Row>
                                                            <Table striped hover >
                                                                <thead>
                                                                    <tr>

                                                                        <th >工單編號</th>
                                                                        {/* <th >工單品名</th> */}
                                                                        <th>累積生產數量</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {history_dispatch[ele].map((everday_work, dd) => {
                                                                        // console.log(everday_work)
                                                                        return (
                                                                            <tr key={`dispatch${dd}`}>
                                                                                <td>{everday_work.dispatchNumber}</td>
                                                                                {/* <td>{everday_work.product_name}</td> */}
                                                                                <td>{everday_work.count}</td>
                                                                            </tr>
                                                                        )
                                                                    })}

                                                                </tbody>
                                                            </Table>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        )


                                    })}

                                </div>

                                {/* <Row>
                                    {history_dispatch !== undefined && Object.keys(history_dispatch).map((ele) => {
                                        return (
                                            <Col key={`${ele}`} md={12}>
                                               
                                                <h5>{ele}</h5>
                                                 <Table striped hover >
                                                    <thead>
                                                        <tr>

                                                            <th >工單編號</th>
                                                            <th>生產數量</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {history_dispatch[ele].map((everday_work, dd) => {
                                                            return (
                                                                <tr key={`dispatch${dd}`}>
                                                                    <td>{everday_work.dispatchNumber}</td>
                                                                    <td>{everday_work.count}</td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </tbody>
                                                </Table>

                                            </Col>
                                        )

                                    })
                                    }
                                </Row> */}

                            </CardBody>

                        </Card>
                    </Col>
                    <Col lg="9" md="9">
                        <Row>
                            <Col md="12">
                                <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardBody>
                                        <Row>

                                            <Col md={4} >
                                                <Card className="card-stats" style={{ backgroundColor: '#6152a0', WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }}>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{'待完成工單'}</CardTitle>
                                                            </Col>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{all_dispatch_not_start !== undefined && all_dispatch_not_start.length}</CardTitle>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md={4} >
                                                <Card className="card-stats" style={{ backgroundColor: '#774e94', WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }}>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{'進行中工單'}</CardTitle>
                                                            </Col>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{all_working_dispatch !== undefined && all_working_dispatch.length}</CardTitle>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md={4} >
                                                <Card className="card-stats" style={{ backgroundColor: '#a75395', WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }}>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{'已完成工單'}</CardTitle>
                                                            </Col>
                                                            <Col xs="12">
                                                                <CardTitle tag="h2">{finish_working_dispatch !== undefined && finish_working_dispatch.length}</CardTitle>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md={12}>
                                                <Table striped hover>
                                                    <thead>
                                                        <tr>

                                                            <th style={{ width: "20%" }}>工單編號</th>
                                                            <th style={{ width: "20%" }}>工單品名</th>
                                                            <th style={{ width: "10%" }}>生產數量</th>
                                                            <th style={{ width: "10%" }}>應完成數量</th>
                                                            <th style={{ width: "60%" }}>進度條</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {all_working_dispatch !== undefined && all_working_dispatch.map((ele, d) => {
                                                            console.log(ele)
                                                            return (
                                                                <tr key={`main ${d}`}>
                                                                    <td>{ele.dispatchNumber}</td>
                                                                    <td>{ele.product_name}</td>
                                                                    <td>{ele.real_count}</td>
                                                                    <td>{ele.qt_count}</td>
                                                                    <td>
                                                                        <div className="progress-container progress-primary">

                                                                            <Progress max={ele.qt_count} value={ele.real_count}>
                                                                                <span className="progress-value">{(ele.real_count / ele.qt_count * 100).toFixed(2)}%</span>
                                                                            </Progress>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </tbody>
                                                </Table>
                                            </Col>
                                            <Col md={12}>

                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>

                            </Col>

                        </Row>

                    </Col>




                </Row>

            </div>
        )

    }

}


