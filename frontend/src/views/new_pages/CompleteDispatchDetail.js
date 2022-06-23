import moment from 'moment';
import React, { forwardRef } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    ModalBody,
    FormGroup,
    Collapse,
    Input,
    Row,
    Col,
    Label
} from "reactstrap";
import { Pie, Bar } from "react-chartjs-2";
import { chartExample9, } from "variables/charts.js";
import * as request from '../../request/index'
export default class FinishDispatchDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: undefined,
            devices: [],
            do_device: [],
            select_devices: [],
            modalClassic: false,
            modalClassic2: false,
            status: false,
            date_list: [],
            datasets: []
        }
    }

    getParameterByName = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };


    async componentDidMount() {
        let id = this.getParameterByName("id")
        let dispatch = await request.get_dispatch_by_id(id)
        console.log(dispatch)

        let pie_data = {
            labels: [1, 2],
            datasets: [
                {
                    label: "Emails",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    backgroundColor: ["#00c09d", "#e2e2e2"],
                    borderWidth: 0,
                    data: [(dispatch.real_count / dispatch.qt_count * 100), 100 - (dispatch.real_count / dispatch.qt_count * 100)],
                },
            ],
        }
        if ((dispatch.real_count / dispatch.qt_count * 100) >= 100) {
            pie_data.datasets[0].data = [100, 0]
        }

        let status = this.getParameterByName("status")




        this.setState({ dispatch: dispatch, pie_data: pie_data, status: status === '' ? false : true })
        await this.get_device()
    }

    random_rgba = () => {
        let color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
        return color;
    }

    compare_date_time = (a, b) => {
        if (a.date_time < b.date_time) {
            return -1;
        }
        if (a.date_time > b.date_time) {
            return 1;
        }
        return 0;
    }

    get_device = async () => {
        // let devices = []
        let { dispatch } = this.state
        let device = await request.get_devices()
        device.sort(this.compare_datetime)

        let use_device = [] //
        device.map((ele) => {
            if (ele.dispatch_first === dispatch.dispatchNumber) {
                use_device.push(ele)

            }
        })


        // device.map()


        let do_device = await request.get_dispatch_device_count(dispatch.dispatchNumber)
        console.log(do_device)
        let history_dispatch_detail = await request.search_deviceDispatch_history(dispatch.dispatchNumber)
        let datasets = []
        let date_list = []
        let buffer
        let color
        let fix_history_dispatch_detail = {}
        history_dispatch_detail.map((ele) => {

            ele.date_time = moment(new Date(ele.date_time)).format("YYYY-MM-DD")

            if (fix_history_dispatch_detail[ele.date_time] === undefined) {
                fix_history_dispatch_detail[ele.date_time] = []
            }
            fix_history_dispatch_detail[ele.date_time].push(ele)
            buffer = date_list.findIndex(elee => elee === ele.date_time)
            if (buffer == -1) {
                date_list.push(ele.date_time)
            }
        })

        date_list.sort()

        date_list.map((date) => {

            do_device.map((elee) => {
                // elee.device_id

                buffer = fix_history_dispatch_detail[date].findIndex(ele => ele.device_id === elee.device_id)
                // console.log(buffer)
                if (buffer == -1) {
                    history_dispatch_detail.push({
                        "device_name": elee.name,
                        "device_id": elee.device_id,
                        "count": 0,
                        "date_time": date
                    })
                }
            })


        })



        history_dispatch_detail.sort(this.compare_date_time)
        console.log(fix_history_dispatch_detail)

        // console.log(history_dispatch_detail)
        history_dispatch_detail.map((ele) => {

            buffer = date_list.findIndex(elee => elee === ele.date_time)
            if (buffer === -1) {
                date_list.push(ele.date_time)
            }

            // console.log(ele)

            buffer = datasets.findIndex(elee => elee.label === ele.device_name)
            // console.log(buffer)
            if (buffer == -1) {
                color = this.random_rgba()
                datasets.push({

                    label: ele.device_name,
                    fill: true,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: color,
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: color,
                    //pointHoverBorderColor:'rgba(35,46,55,1)',
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [ele.count],
                })
            } else {
                datasets[buffer].data.push(ele.count)
            }

        })

        // console.log(history_dispatch_detail)
        console.log(datasets)
        console.log(date_list)


        this.setState({ devices: device, do_device: do_device, select_devices: use_device, datasets: datasets, date_list: date_list, date_json: fix_history_dispatch_detail })
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

    colList = async (col) => {

        let select_devices = this.state.select_devices
        let buffer = select_devices.findIndex(ele => ele.id === col.id)
        // console.log(col)
        // console.log(select_devices)
        // console.log(buffer)

        if (buffer === -1) {

            select_devices.push(col)
        } else {
            select_devices.splice(buffer, 1)
        }
        console.log(select_devices)
        this.setState({ select_devices: select_devices })
    }

    toggleModalClassic = () => {
        this.setState({ modalClassic: !this.state.modalClassic })
    }
    toggleModalClassic2 = () => {
        this.setState({ modalClassic2: !this.state.modalClassic2 })
    }
    downloadfile = async () => {
        let { dispatch } = this.state

        await request.downloadfile(dispatch.dispatchNumber)
    }


    render() {
        let { dispatch, devices, modalClassic, select_devices, do_device, modalClassic2, pie_data, date_list, datasets, status, date_json } = this.state
        return (
            <>
                {dispatch !== undefined &&
                    <div className="content">

                        <Row>
                            <Col md={8}>
                                <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardBody>
                                        <h4>工單編號: {dispatch.dispatchNumber}</h4>
                                        <h4>工單品名: {dispatch.product_name}</h4>
                                        <h4>料件編號: {dispatch.material_code}</h4>
                                        <h4>產品規格: {dispatch.specification}</h4>
                                        <h4>製造部門: {dispatch.department}</h4>
                                        <h4>應生產數量: {dispatch.qt_count}</h4>
                                        <h4>目前生產數量: {dispatch.real_count}</h4>
                                        <h4>預計開工日: {moment(dispatch.guess_start_date).format("YYYY-MM-DD")}</h4>
                                        <h4>預計完工日: {moment(dispatch.guess_end_date).format("YYYY-MM-DD")}</h4>
                                        <h4>實際開工日: {moment(dispatch.real_start_date).format("YYYY-MM-DD HH:mm:ss")}</h4>
                                        <h4>實際完工日: {dispatch.real_end_date !== null ? moment(dispatch.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Row>
                                    <Col md={12}>
                                        <Card className="card-chart card-chart-pie" style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                            <CardHeader>
                                                <h4>目前完成比例</h4>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col xs="6">
                                                        <div className="chart-area">
                                                            <Pie
                                                                data={pie_data}
                                                                options={chartExample9.options}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xs="6">
                                                        <CardTitle tag="h3">
                                                            <i className="tim-icons icon-trophy text-success" />{" "}
                                                            {dispatch.real_count}
                                                        </CardTitle>
                                                        {/* <p className="category">應完成數量: {dispatch.qt_count}</p> */}
                                                        <h4>應完成數量: {dispatch.qt_count}</h4>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    {/* <Col md={12}>
                                        <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                            <CardBody>
                                                <Row>
                                                    <Col md={12}>
                                                        <h4>可用數位計數器列表</h4>
                                                    </Col>
                                                    {devices.map((ele, d) => {
                                                        // console.log(ele.dispatch_first)

                                                        return (
                                                            <Col md={12} key={`device ${d}`}>
                                                                <FormGroup check inline disabled={true}>
                                                                    <Label check style={{ fontSize: '14px' }}>
                                                                        <Input type="checkbox" onClick={() => this.colList(ele)} disabled={true} />
                                                                        <span className="form-check-sign" />{ele.name} / {ele.client_id}

                                                                    </Label>
                                                                </FormGroup>
                                                            </Col>
                                                        )


                                                    })}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col> */}
                                </Row>


                            </Col>
                            <Col md={12}>
                                <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardHeader>
                                        <CardTitle>工作履歷</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            {do_device.map((ele, d) => {
                                                return (
                                                    <Col lg="3" md="6" key={`device key ${d}`}>
                                                        <Card className="card-stats" style={{ backgroundColor: '#1d8cf8' }}>

                                                            <CardBody>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <h5>設備名稱: {ele.name}</h5>

                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <h5>完成數量: {ele.count}</h5>
                                                                        {/* <h5>更新時間: {moment(ele.date_time).format("YYYY-MM-DD HH:mm:ss")}</h5> */}
                                                                    </Col>
                                                                    <Col md={12}>

                                                                        <h5>更新時間: {moment(ele.date_time).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                                                    </Col>
                                                                    {/* <Col xs="5">
                                                                        <div className={`info-icon text-center icon-${ele.status === true ? 'success' : 'warning'}`}>
                                                                            <i className="tim-icons icon-heart-2" />
                                                                        </div>
                                                                      
                                                                    </Col>
                                                                    <Col xs="7">
                                                                        <div className="numbers">
                                                                            <p className="card-category">{ele.name}</p>
                                                                            <CardTitle tag="h3">{ele.count}</CardTitle>
                                                                        </div>
                                                                    </Col> */}
                                                                </Row>
                                                            </CardBody>

                                                        </Card>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={6}>
                                {datasets.length !== 0 &&
                                    <Betweenfrom key={Math.random()} date_list={date_list} datasets={datasets} />
                                }
                            </Col>


                            <Col md="6">
                                {date_json !== undefined && <DateList data={date_json} />}
                            </Col>

                            <Col md={12}>

                                <Button block onClick={() => this.downloadfile()} color="info" >下載原始資料</Button>
                            </Col>


                        </Row>


                    </div>
                }
            </>
        )
    }
}

class Betweenfrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                labels: props.date_list,
                datasets:
                    props.datasets
                // {
                //     label: '當日生產模次',
                //     data: props.data_count,
                //     backgroundColor: '#66ff66',
                //     borderColor: '#66ff66',
                //     borderWidth: 1,
                //     fill: true,

                // },
                // {
                //     label: '異常',
                //     data: props.err_data_count_list,
                //     backgroundColor: '#ff3333',
                //     borderColor: '#ff3333',
                //     borderWidth: 1,
                //     fill: true,
                // },

            },
            options: {
                maintainAspectRatio: false,
                // legend: {
                //   display: false,
                // },
                tooltips: {
                    backgroundColor: "#f5f5f5",
                    titleFontColor: "#333",
                    bodyFontColor: "#666",
                    bodySpacing: 4,
                    xPadding: 12,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                },

                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        }
                    }]
                },
                // onClick: (e, element) => {
                //     if (element.length > 0) {
                //       var ind = element[0]._index;
                //       console.log(element[0])
                //       alert(ind);
                //     }
                //   },
            }
        }
    }


    render() {
        let { data, options } = this.state
        console.log(data)
        console.log(options)
        return (
            <Card className="card-chart">
                <CardHeader>
                    <CardTitle tag="h3">每日累計生產總數</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-area">
                        <Bar data={data} options={options} style={{ height: "100vh" }} />
                    </div>
                </CardBody>
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
    }
    downloadfile = async () => {
        // console.log(this.props.test)
        let result = await request.downloadfile_post({ json_data: this.props.data })
        console.log(result)
    }

    render() {
        let { openedCollapseOne, data } = this.state
        // console.log('fuck')
        return (
            <Card>
                <CardHeader>

                    <CardTitle tag="h3">每日工單履歷</CardTitle>
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
                                                return (
                                                    <Col md={12} key={`deivce${dd}`}>
                                                        <h4>設備名稱: {everday_work.device_name} / 累計生產數量: {everday_work.count} </h4>
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
                {/* <Button onClick={() => this.downloadfile()} color="info" >下載檔案</Button> */}
            </Card>
        )
    }
}