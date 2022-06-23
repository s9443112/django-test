import React, { forwardRef, useState, useEffect, useRef } from 'react';

import * as request from '../../request/index'
import ReactDatetime from "react-datetime";
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

export default class Overview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: []
        }
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

    do_something = async (date) => {
        console.log(date)
        let dispatch = await request.select_dispatchdetail_by_today(date)
        console.log(dispatch)
        this.setState({
            dispatch: dispatch
        })

        let users = await request.get_users()
        let index

        let devices_history = {}
        dispatch.map((ele) => {
            ele["device_dispatch_list"].map((elee) => {
                
                if (devices_history[elee.user_info.name] === undefined) {
                    devices_history[elee.user_info.name] = []
                }
                devices_history[elee.user_info.name].push({
                    "dispatchNumber": `${ele.dispatchNumber}`,
                    "count": elee.count,
                    "material_code": ele.material_code
                })
            })
        })
        // console.log(devices_history)
        // console.log(JSON.stringify(devices_history))

        this.setState({
            devices_history: devices_history,
            date:date
        })


    }

    async componentDidMount() {
        let date = moment(new Date()).format("YYYY-MM-DD")
        
        
        await this.do_something(date)
    }

    downloadfile = async () => {
        let {date,devices_history} = this.state 
        let result = await request.downloadfile_post_today({ json_data: devices_history,date: moment(date).format("YYYY-MM-DD") }, `${moment(date).format("YYYY-MM-DD")}_剪口團體日報表`)
    }

    render() {
        let { dispatch, date } = this.state
        // console.log(dispatch)
        return (
            <div className="content">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">選擇日期</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <FormGroup>
                            <ReactDatetime
                                inputProps={{
                                    className: "form-control",
                                    placeholder: "Date Picker Here",
                                }}
                                initialValue={moment(date)}
                                onChange={async (e) => { await this.do_something(e.format("YYYY-MM-DD")) }}
                                timeFormat={false}
                            />
                        </FormGroup>
                    </CardBody>
                </Card>
                <Row>

                    {dispatch.map((ele, d) => {
                        // console.log(ele)
                        return (
                            <Col lg="6" md="6" key={`device key ${d}`}>
                                <Card className="card-stats" style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardBody>
                                        <Row>

                                            <Col md="9">
                                                <h2 style={{ textAlign: 'left' }}>工單號碼: {ele.dispatchNumber} / 品名: {ele.product_name}</h2>
                                            </Col>
                                            <Col md="3">
                                                <CardTitle style={{ textAlign: 'right' }} tag="h3">{ele.status === 'finish' ? '已結單' : '未結單'} - {ele.real_count} / {ele.qt_count}</CardTitle>
                                            </Col>


                                            <Col md="12">
                                                <Row>
                                                    {ele["device_dispatch_list"] !== undefined && ele.device_dispatch_list.map((elee, dd) => {
                                                        // console.log(elee)
                                                        return (
                                                            <Col lg="4" md="6" key={`device key ${dd}`}>
                                                                <Card onClick={() => window.location.href = `/admin/virtual_device?id=${elee.device_id}`} style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.3))" }} >
                                                                    <CardBody>
                                                                        <Row>
                                                                            <Col md="4" >
                                                                                {elee.status === true ? <img src={`${process.env.PUBLIC_URL}/static/Green_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img> :
                                                                                    <img src={`${process.env.PUBLIC_URL}/static/Red_Light_Icon.svg`} alt="logo" style={{ width: 85 }}></img>}
                                                                                {/* <div className={`info-icon text-center icon-success`}>
                                                                                    <i className="tim-icons icon-heart-2" />
                                                                                </div> */}

                                                                            </Col>

                                                                            <Col md="8">
                                                                                <div className="numbers">
                                                                                    <CardTitle tag="h2">{elee.device_name} / {elee.user_info.name}</CardTitle>
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
                                                <h4>預計完工日: {moment(new Date(ele.guess_end_date)).format("YYYY-MM-DD")}</h4>
                                            </Col>
                                        </Row>
                                    </CardBody>

                                </Card>
                            </Col>
                        )
                    })}

                    <Col md={12}>

                        <Button block onClick={() => this.downloadfile()} color="info" >下載剪口團體日報表(主管報)</Button>
                    </Col>

                </Row>

            </div>
        )

    }

}