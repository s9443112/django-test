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
    Spinner
} from "reactstrap";
import Select from "react-select";
import mqtt from 'mqtt';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
var options = {
    username: 'iii',
    password: 'iii05076416',
    port: 8087,
}
// var client = mqtt.connect('ws://139.162.96.124', options)

export default class BookDevice extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: [],
            dispatch_first: { "value": null },
            dispatch_second: { "value": null },
            dispatch_third: { "value": null },
            dispatch_4: { "value": null },
            dispatch_5: { "value": null },
            dispatch_6: { "value": null },
            dispatch_7: { "value": null },
            dispatch_8: { "value": null },
            _load: true
        }
    }



    async componentDidMount() {
        await this.do_something()
        await this.get_all_dispatch()
    }
    do_something = async () => {
        let devices = await request.get_users()

        devices.sort(this.compare_id)
        let devices_list = []
        devices.map((ele) => {
            devices_list.push({
                value: ele.id,
                label: `名稱: ${ele.name}`
            })
        })
        this.setState({ devices: devices_list, device: devices_list[0], })
    }

    get_all_dispatch = async () => {
        let dispatch = await request.get_dispatch_by_status(0)
        let dispatch_doing = await request.get_dispatch_by_status(1)

        dispatch.push.apply(dispatch, dispatch_doing)

        let dispatch_list = [{
            label: '無工單',
            value: null
        }]

        dispatch.map((ele) => {
            dispatch_list.push({
                value: ele.dispatchNumber,
                label: `工單: ${ele.dispatchNumber} / 應完成: ${ele.qt_count} / 目前完成: ${ele.real_count}`
            })
        })
        console.log(dispatch_list)

        this.setState({ dispatchs: dispatch_list, origin_dispatchs: dispatch })
    }

    SearchHistory = async () => {
        this.setState({_load: true})
        let { device, dispatchs, origin_dispatchs } = this.state
        // console.log(device)

        let result = await request.get_device_by_user(device.value)

        console.log(result)
        console.log(dispatchs)

        let dispatch_first = dispatchs.find(ele => ele.value === result.dispatch_first)
        let dispatch_second = dispatchs.find(ele => ele.value === result.dispatch_second)
        let dispatch_third = dispatchs.find(ele => ele.value === result.dispatch_third)
        let dispatch_4 = dispatchs.find(ele => ele.value === result.dispatch_4)
        let dispatch_5 = dispatchs.find(ele => ele.value === result.dispatch_5)
        let dispatch_6 = dispatchs.find(ele => ele.value === result.dispatch_6)
        let dispatch_7 = dispatchs.find(ele => ele.value === result.dispatch_7)
        let dispatch_8 = dispatchs.find(ele => ele.value === result.dispatch_8)

        this.setState({
            dispatch_first: dispatch_first === undefined ? { "value": null } : dispatch_first,
            dispatch_second: dispatch_second === undefined ? { "value": null } : dispatch_second,
            dispatch_third: dispatch_third === undefined ? { "value": null } : dispatch_third,
            dispatch_4: dispatch_4 === undefined ? { "value": null } : dispatch_4,
            dispatch_5: dispatch_5 === undefined ? { "value": null } : dispatch_5,
            dispatch_6: dispatch_6 === undefined ? { "value": null } : dispatch_6,
            dispatch_7: dispatch_7 === undefined ? { "value": null } : dispatch_7,
            dispatch_8: dispatch_8 === undefined ? { "value": null } : dispatch_8,
            origin_device: result
        })

        let dispatch_first_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_first)
        let dispatch_second_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_second)
        let dispatch_third_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_third)
        let dispatch_4_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_4)
        let dispatch_5_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_5)
        let dispatch_6_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_6)
        let dispatch_7_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_7)
        let dispatch_8_data = origin_dispatchs.find(ele => ele.dispatchNumber === result.dispatch_8)

        this.setState({
            dispatch_first_data: dispatch_first_data,
            dispatch_second_data: dispatch_second_data,
            dispatch_third_data: dispatch_third_data,
            dispatch_4_data: dispatch_4_data,
            dispatch_5_data: dispatch_5_data,
            dispatch_6_data: dispatch_6_data,
            dispatch_7_data: dispatch_7_data,
            dispatch_8_data: dispatch_8_data,
        })
        this.setState({_load: false})
    }


    make_dispatch_view = async () => {
        let { device, dispatchs, origin_dispatchs } = this.state
        let {
            dispatch_first,
            dispatch_second,
            dispatch_third,
            dispatch_4,
            dispatch_5,
            dispatch_6,
            dispatch_7,
            dispatch_8,
        } = this.state

        console.log(123123123)
        console.log(dispatch_second)
        console.log(this.state)

        let dispatch_first_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_first.value)
        let dispatch_second_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_second.value)
        let dispatch_third_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_third.value)
        let dispatch_4_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_4.value)
        let dispatch_5_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_5.value)
        let dispatch_6_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_6.value)
        let dispatch_7_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_7.value)
        let dispatch_8_data = origin_dispatchs.find(ele => ele.dispatchNumber === dispatch_8.value)

        this.setState({
            dispatch_first_data: dispatch_first_data,
            dispatch_second_data: dispatch_second_data,
            dispatch_third_data: dispatch_third_data,
            dispatch_4_data: dispatch_4_data,
            dispatch_5_data: dispatch_5_data,
            dispatch_6_data: dispatch_6_data,
            dispatch_7_data: dispatch_7_data,
            dispatch_8_data: dispatch_8_data,
        })
    }

    save = async () => {
        let {
            dispatch_first,
            dispatch_second,
            dispatch_third,
            dispatch_4,
            dispatch_5,
            dispatch_6,
            dispatch_7,
            dispatch_8,
            origin_device

        } = this.state

        let data = {
            dispatch_second: dispatch_second,
            dispatch_third: dispatch_third,
            dispatch_4: dispatch_4,
            dispatch_5: dispatch_5,
            dispatch_6: dispatch_6,
            dispatch_7: dispatch_7,
            dispatch_8: dispatch_8,
        }
        // console.log(data)
        // console.log(origin_device)

        origin_device.dispatch_second = dispatch_second.value
        origin_device.dispatch_third = dispatch_third.value
        origin_device.dispatch_4 = dispatch_4.value
        origin_device.dispatch_5 = dispatch_5.value
        origin_device.dispatch_6 = dispatch_6.value
        origin_device.dispatch_7 = dispatch_7.value
        origin_device.dispatch_8 = dispatch_8.value

        


        console.log(origin_device)
        let result = await request.put_devices(origin_device.id, origin_device)
        // console.log(result)

        window.alert("預排成功!")

    }



    render() {
        let { devices, device, result, dispatchs, _load } = this.state
        let {
            dispatch_first,
            dispatch_second,
            dispatch_third,
            dispatch_4,
            dispatch_5,
            dispatch_6,
            dispatch_7,
            dispatch_8,
            dispatch_first_data,
            dispatch_second_data,
            dispatch_third_data,
            dispatch_4_data,
            dispatch_5_data,
            dispatch_6_data,
            dispatch_7_data,
            dispatch_8_data,
        } = this.state
        // console.log(dispatch)
        return (
            <div className="content">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2">選擇人員</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form action="#">

                            <label style={{ fontSize: '20px' }}>選擇人員</label>
                            <FormGroup>
                                <Select
                                    className="react-select info"
                                    classNamePrefix="react-select"
                                    name="singleSelect"
                                    value={device}
                                    onChange={(value) => this.setState({ device: value, _load: true })}
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
                <Row>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                {_load !== true &&
                                    <Form>
                                        {/* <label style={{ fontSize: '20px' }}>工單預排1</label>
                                    <FormGroup>
                                        <Select
                                            className="react-select info"
                                            classNamePrefix="react-select"
                                            name="singleSelect"
                                            value={dispatch_first}
                                            onChange={async (value) => {
                                                console.log(value)
                                                this.setState({dispatch_first: value},async ()=>{
                                                    await this.make_dispatch_view()
                                                })
                                            }}
                                            options={dispatchs}
                                            placeholder="選擇工單"
                                        />
                                    </FormGroup> */}
                                        <label style={{ fontSize: '20px' }}>工單預排1</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_second}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_second: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排2</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_third}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_third: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排3</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_4}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_4: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排4</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_5}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_5: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排5</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_6}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_6: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排6</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_7}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_7: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>
                                        <label style={{ fontSize: '20px' }}>工單預排7</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="singleSelect"
                                                value={dispatch_8}
                                                onChange={async (value) => {
                                                    console.log(value)
                                                    this.setState({ dispatch_8: value }, async () => {
                                                        await this.make_dispatch_view()
                                                    })
                                                }}
                                                options={dispatchs}
                                                placeholder="選擇工單"
                                            />
                                        </FormGroup>

                                    </Form>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={8}>
                        {_load !== true &&
                            <Card>
                                <CardBody>

                                    <Carousel autoPlay>


                                        {/* <div className='initdd'>
                                        <p className="legend" >正在執行</p>
                                        {dispatch_first_data !== undefined &&
                                            <>
                                                <h4>工單編號: {dispatch_first_data.dispatchNumber}</h4>
                                                <h4>工單品名: {dispatch_first_data.product_name}</h4>
                                                <h4>料件編號: {dispatch_first_data.material_code}</h4>
                                                <h4>產品規格: {dispatch_first_data.specification}</h4>
                                                <h4>製造部門: {dispatch_first_data.department}</h4>
                                                <h4>應生產數量: {dispatch_first_data.qt_count}</h4>
                                                <h4>目前生產數量: {dispatch_first_data.real_count}</h4>
                                                <h4>預計開工日: {moment(dispatch_first_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                <h4>預計完工日: {moment(dispatch_first_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                <h4>實際開工日: {moment(dispatch_first_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                <h4>實際完工日: {dispatch_first_data.real_end_date !== null ? moment(dispatch_first_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                            </>
                                        }

                                    </div> */}
                                        <div className='initdd'>
                                            <p className="legend">預排1</p>
                                            {dispatch_second_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_second_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_second_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_second_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_second_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_second_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_second_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_second_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_second_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_second_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_second_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_second_data.real_end_date !== null ? moment(dispatch_second_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排2</p>
                                            {dispatch_third_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_third_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_third_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_third_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_third_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_third_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_third_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_third_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_third_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_third_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_third_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_third_data.real_end_date !== null ? moment(dispatch_third_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排3</p>
                                            {dispatch_4_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_4_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_4_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_4_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_4_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_4_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_4_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_4_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_4_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_4_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_4_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_4_data.real_end_date !== null ? moment(dispatch_4_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排4</p>
                                            {dispatch_5_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_5_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_5_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_5_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_5_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_5_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_5_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_5_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_5_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_5_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_5_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_5_data.real_end_date !== null ? moment(dispatch_5_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排5</p>
                                            {dispatch_6_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_6_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_6_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_6_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_6_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_6_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_6_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_6_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_6_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_6_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_6_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_6_data.real_end_date !== null ? moment(dispatch_6_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排6</p>
                                            {dispatch_7_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_7_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_7_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_7_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_7_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_7_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_7_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_7_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_7_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_7_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_7_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_7_data.real_end_date !== null ? moment(dispatch_7_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>
                                        <div className='initdd'>
                                            <p className="legend">預排7</p>
                                            {dispatch_8_data !== undefined &&
                                                <>
                                                    <h4>工單編號: {dispatch_8_data.dispatchNumber}</h4>
                                                    <h4>工單品名: {dispatch_8_data.product_name}</h4>
                                                    <h4>料件編號: {dispatch_8_data.material_code}</h4>
                                                    <h4>產品規格: {dispatch_8_data.specification}</h4>
                                                    <h4>製造部門: {dispatch_8_data.department}</h4>
                                                    <h4>應生產數量: {dispatch_8_data.qt_count}</h4>
                                                    <h4>目前生產數量: {dispatch_8_data.real_count}</h4>
                                                    <h4>預計開工日: {moment(dispatch_8_data.guess_start_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>預計完工日: {moment(dispatch_8_data.guess_end_date).format("YYYY-MM-DD")}</h4>
                                                    <h4>實際開工日: {moment(dispatch_8_data.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                                    <h4>實際完工日: {dispatch_8_data.real_end_date !== null ? moment(dispatch_8_data.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                                </>
                                            }
                                        </div>

                                    </Carousel>

                                </CardBody>
                            </Card>
                        }
                    </Col>
                    <Col md={12}>
                        <Button block onClick={() => this.save()} color="info" >儲存</Button>
                    </Col>
                </Row>

            </div>
        )

    }

}