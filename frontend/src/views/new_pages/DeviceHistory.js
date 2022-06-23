import React, { forwardRef } from 'react';
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
    UncontrolledAlert,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Collapse
} from "reactstrap";
import Select from "react-select";
import { Bar, Line } from "react-chartjs-2";

export default class DeviceHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            start_time: moment(new Date()).subtract(7, 'days').format("YYYY-MM-DD"),
            end_time: moment(new Date()).format("YYYY-MM-DD"),
            data: [],
            openedCollapseOne: true
        }
    }

    compare_id = (a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }
    compare_count = (a, b) => {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count < b.count) {
            return 1;
        }
        return 0;
    }

    async componentDidMount() {
        // let devices = await request.get_devices()
        // devices.sort(this.compare_id)
        // let devices_list = []
        // devices.map((ele) => {
        //     devices_list.push({
        //         value: ele.id,
        //         label: `設備名稱: ${ele.name} / ID: ${ele.client_id}`
        //     })
        // })

        // this.setState({ devices: devices_list, device: devices_list[0] })
        let devices = await request.get_users()
        devices.sort(this.compare_id)
        let devices_list = []
        devices.map((ele) => {
            devices_list.push({
                value: ele.id,
                label: `名稱: ${ele.name}`
            })
        })
        this.setState({ devices: devices_list, device: devices_list[0] })

    }

    random_rgba = () => {
        let color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
        return color;
    }
    getRandom = (min, max) => {
        return Math.floor(Math.random() * max) + min;
    };

    uniqByKeepFirst = (a, key) => {
        let seen = new Set();
        return a.filter(item => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }

    SearchHistory = async () => {
        let start_time = this.state.start_time
        let end_time = moment(new Date(this.state.end_time)).add(1, "days").format("YYYY-MM-DD")
        let device = this.state.device
        console.log(device)
        let data = {
            today_start: start_time,
            today_end: end_time,
            user_id: device.value
        }

        // console.log(data)

        let result = await request.search_DeviceDispatch_by_device(data)
        console.log(result)
        let buffer = await request.select_deviceCount_by_device(device.value)

        result.push.apply(result, buffer)


        // console.log(result)
        let dispatch_json = await this.make_dispatch_json(result)
        let date_json = await this.make_date_json(result)
        // console.log(date_json)
        console.log(JSON.stringify(date_json))
        this.setState({ dispatch_json: undefined, date_json: undefined, test: undefined })
        this.setState({ dispatch_json: dispatch_json, date_json: date_json, test: result })

    }

    make_dispatch_json = async (result) => {
        // console.log(result)
        let obj_data = {}
        result.map((ele) => {
            if (obj_data[ele.dispatchNumber] === undefined) {
                obj_data[ele.dispatchNumber] = []
            }
            ele.date_time = moment(ele.date_time).format("YYYY-MM-DD")
            obj_data[ele.dispatchNumber].push(ele)
            obj_data[ele.dispatchNumber].sort(this.compare_count)
            obj_data[ele.dispatchNumber] = this.uniqByKeepFirst(obj_data[ele.dispatchNumber], it => it.count)
            obj_data[ele.dispatchNumber] = this.uniqByKeepFirst(obj_data[ele.dispatchNumber], it => it.date_time)

        })
        // console.log(obj_data)
        return obj_data

    }

    make_date_json = async (resulter) => {
        console.log(resulter)
        let result = JSON.parse(JSON.stringify(resulter))
        let obj_data = {}
        let check
        let last_day
        let i
        result.map((ele) => {


            if (obj_data[moment(ele.date_time).format("YYYY-MM-DD")] === undefined) {
                obj_data[moment(ele.date_time).format("YYYY-MM-DD")] = []
            }
            ele.date_time = moment(ele.date_time).format("YYYY-MM-DD")
            i = 1
            while (1) {
                last_day = moment(ele.date_time).subtract(i, 'days').format("YYYY-MM-DD")
                if (obj_data[last_day] !== undefined) {
                    console.log(obj_data[last_day])
                    console.log(ele)
                    check = obj_data[last_day].find(elee => elee.dispatchNumber === ele.dispatchNumber)
                    if (check !== undefined) {
                        ele.count = ele.count - check.count
                    }

                } else {
                    break
                }
                i = i + 1
            }



            obj_data[moment(ele.date_time).format("YYYY-MM-DD")].push(ele)
            obj_data[moment(ele.date_time).format("YYYY-MM-DD")].sort(this.compare_count)
            obj_data[moment(ele.date_time).format("YYYY-MM-DD")] = this.uniqByKeepFirst(obj_data[moment(ele.date_time).format("YYYY-MM-DD")], it => it.dispatchNumber)
        })
        // console.log(obj_data)
        return obj_data

    }

    render() {
        let { start_time, end_time, devices, device, dangeralert, betweenfrom, dispatch_json, date_json, test } = this.state
        // console.log(dispatch_json)
        return (
            <div className="content">
                <Row className="mt-12">
                    {dangeralert}
                    <Col md="12" className="ml-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">人員歷史</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form action="#">
                                    <label style={{ fontSize: '20px' }}>開始時間</label>
                                    <FormGroup>
                                        <ReactDatetime
                                            inputProps={{
                                                className: "form-control",
                                                placeholder: "開始時間",
                                            }}
                                            style={{ fontSize: '20px' }}
                                            timeFormat={false}
                                            dateFormat={"YYYY-MM-DD"}
                                            initialValue={start_time}
                                            onChange={(e) => { this.setState({ start_time: moment(e).format('YYYY-MM-DD') }) }}
                                        />
                                    </FormGroup>
                                    <label style={{ fontSize: '20px' }}>結束時間</label>
                                    <FormGroup>
                                        <ReactDatetime
                                            inputProps={{
                                                className: "form-control",
                                                placeholder: "結束時間",
                                            }}
                                            style={{ fontSize: '20px' }}
                                            timeFormat={false}
                                            dateFormat={"YYYY-MM-DD"}
                                            initialValue={end_time}
                                            onChange={(e) => { this.setState({ end_time: moment(e).format('YYYY-MM-DD') }) }}
                                        />
                                    </FormGroup>
                                    <label style={{ fontSize: '20px' }}>選擇設備</label>
                                    <FormGroup>
                                        <Select
                                            className="react-select info"
                                            classNamePrefix="react-select"
                                            name="singleSelect"
                                            value={device}
                                            onChange={(value) => this.setState({ device: value })}
                                            options={devices}
                                            placeholder="選擇設備"
                                        />
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="btn-fill" color="primary" type="submit" onClick={this.SearchHistory}>
                                    送出
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col md="6">
                        {dispatch_json !== undefined && <DispatchList data={dispatch_json} />}
                    </Col>
                    <Col md="6">
                        {date_json !== undefined && <DateList data={date_json} test={test} />}
                    </Col>
                    {/* <Col md={12} sm={12} className="mr-auto">
                        {drawfrom}
                    </Col>
                    <Col md={12} sm={12} className="ml-auto">
                        {linefrom}
                    </Col> */}

                    <Col md={12} sm={12} className="mr-auto">
                        {betweenfrom}
                    </Col>
                </Row>
            </div>
        )
    }
}


class DispatchList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            openedCollapseOne: true
        }
    }

    async componentDidMount() {
        let { data } = this.state
        let buffer
        Object.keys(data).map((ele) => {
            buffer = {}
            buffer[ele] = false
            this.setState(buffer)
        })
    }

    render() {
        let { openedCollapseOne, data } = this.state
        // console.log('fuck')
        return (
            <Card>
                <CardHeader>

                    <CardTitle tag="h3">個人工單履歷</CardTitle>
                </CardHeader>
                <div
                    aria-multiselectable={true}
                    className="card-collapse"
                    id="accordion"
                    role="tablist"
                >
                    {Object.keys(data).map((ele) => {
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
                                        工單號碼: {ele}{" "}
                                        <i className="tim-icons icon-minimal-down" />
                                    </a>
                                </CardHeader>
                                <Collapse role="tabpanel" isOpen={this.state[ele]}>
                                    <CardBody>
                                        <Row>
                                            {data[ele].map((everday_work, dd) => {
                                                return (
                                                    <Col md={12} key={`deivce${dd}`}>
                                                        <h4>生產日期: {moment(everday_work.date_time).format("YYYY-MM-DD")} / 累計生產數量: {everday_work.count} </h4>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        )


                    })}

                </div>
            </Card>
        )
    }
}



class DateList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            openedCollapseOne: true
        }
    }

    async componentDidMount() {
        let { data } = this.state
        let buffer
        Object.keys(data).map((ele) => {
            buffer = {}
            buffer[ele] = false
            this.setState(buffer)
        })

        console.log(this.state.data)
    }
    downloadfile = async () => {
        console.log(this.props.data)
        let result = await request.downloadfile_post({ json_data: this.props.data }, '個人生產日報表')
        console.log(result)
    }

    render() {
        let { openedCollapseOne, data } = this.state
        // console.log('fuck')
        return (
            <Card>
                <CardHeader>

                    <CardTitle tag="h3">每日個人工作履歷</CardTitle>
                </CardHeader>
                <div
                    aria-multiselectable={true}
                    className="card-collapse"
                    id="accordion"
                    role="tablist"
                >
                    {Object.keys(data).map((ele) => {
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
                                            {data[ele].map((everday_work, dd) => {
                                                // console.log(everday_work)
                                                return (
                                                    <Col md={12} key={`deivce${dd}`}>
                                                        <h4>工單編號: {everday_work.dispatchNumber} / 品名: {everday_work.product_name} / 當日生產數量: {everday_work.count} </h4>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        )


                    })}

                </div>
                <Button onClick={() => this.downloadfile()} color="info" >下載檔案</Button>
            </Card>
        )
    }
}