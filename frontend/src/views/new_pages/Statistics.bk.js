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
} from "reactstrap";
import { Bar, Line } from "react-chartjs-2";

export default class Statistics extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            start_time: moment(new Date()).subtract(7, 'days').format("YYYY-MM-DD"),
            end_time: moment(new Date()).format("YYYY-MM-DD"),
            data: [],
        }
    }

    random_rgba = () => {
        let color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
        return color;
    }
    getRandom = (min, max) => {
        return Math.floor(Math.random() * max) + min;
    };

    SearchHistory = async () => {

        try {

            //----------查詢每日模次次數-----------------//
            let data = await request.get_toyo_count({
                start_time: this.state.start_time,
                end_time: moment(new Date(this.state.end_time)).add(1, "days").format("YYYY-MM-DD")
            })

            let data_count = []
            let err_data_count_list = []
            let err_data_count = 0
            let date_list = []
            let color_list = []
            let buffer
            data.map((ele) => {
                // buffer = parseInt(parseInt(ele.count) / this.getRandom(8, 10))
                buffer = this.getRandom(8, 10)

                data_count.push(parseInt(ele.count))
                err_data_count_list.push(buffer)
                date_list.push(moment(new Date(ele.date)).format("YYYY-MM-DD"))
                color_list.push(this.random_rgba())

                err_data_count = err_data_count + buffer
            })
            date_list = date_list.reverse()
            data_count = data_count.reverse()
            let bufferX = JSON.parse(JSON.stringify(err_data_count_list))

            this.setState({ drawfrom: <DrawFrom key={Math.random()} data_count={data_count} date_list={date_list} color_list={color_list} /> })
            this.setState({ betweenfrom: <Betweenfrom key={Math.random()} err_data_count_list={bufferX.reverse()} data_count={data_count} date_list={date_list} color_list={color_list} /> })


            //--------查詢現在每日--------//
            let buffer_data = await request.get_toyo_history({
                limit: 1
            })
            let laster_counter = 0
            if (buffer_data.length !== 0) {
                laster_counter = parseInt(buffer_data[0].counter)
            }
            let continu_data_count = []
            let continu_err_data_count = []
            for (let i in data_count) {
                continu_data_count.push(laster_counter)
                continu_err_data_count.push(err_data_count)
                laster_counter = laster_counter - data_count[i]
                err_data_count = err_data_count - err_data_count_list[i]
                // err_data_count = err_data_count - 
                console.log(continu_err_data_count)

            }
            continu_data_count = continu_data_count.reverse()
            continu_err_data_count = continu_err_data_count.reverse()
            this.setState({ linefrom: <LineChart key={Math.random()} data={continu_data_count} continu_err_data_count={continu_err_data_count} date_list={date_list} laster_counter={parseInt(buffer_data[0].counter)} /> })
            this.setState({ dangeralert: undefined })
        } catch (err) {
            this.setState({
                dangeralert: <Col sm={12}><UncontrolledAlert color="danger" fade={true}>
                    <span>
                        <b>Danger - </b>
                        無法正常取得資料
                    </span>
                </UncontrolledAlert></Col>
            })
        }
    }

    render() {
        let { start_time, end_time, drawfrom, linefrom, dangeralert, betweenfrom } = this.state
        return (
            <div className="content">
                <Row className="mt-12">
                    {dangeralert}
                    <Col md="12" className="ml-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">統計數據</CardTitle>
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


                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="btn-fill" color="primary" type="submit" onClick={this.SearchHistory}>
                                    送出
                                </Button>
                            </CardFooter>
                        </Card>
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


class Betweenfrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                labels: props.date_list,
                datasets: [
                    {
                        label: '當日生產模次',
                        data: props.data_count,
                        backgroundColor: '#66ff66',
                        borderColor: '#66ff66',
                        borderWidth: 1,
                        fill: true,

                    },
                    {
                        label: '異常',
                        data: props.err_data_count_list,
                        backgroundColor: '#ff3333',
                        borderColor: '#ff3333',
                        borderWidth: 1,
                        fill: true,
                    },
                ],
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
                onClick: (e, element) => {
                    if (element.length > 0) {
                      var ind = element[0]._index;
                      console.log(element[0])
                      alert(ind);
                    }
                  },
            }
        }
    }


    render() {
        let { data, options } = this.state
        return (
            <Card className="card-chart">
                <CardHeader>
                    <CardTitle tag="h3">每日累計生產總數</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-area">
                        <Bar data={data} options={options} onClick={this.handleClick} />
                    </div>
                </CardBody>
            </Card>
        )
    }

}

class DrawFrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                labels: props.date_list,
                datasets: [
                    {
                        label: '當日生產模次',
                        data: props.data_count,
                        backgroundColor: props.color_list,
                        borderColor: props.color_list,
                        borderWidth: 1,
                        fill: true,
                    },
                ],
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
                            // suggestedMin: 60,
                            // suggestedMax: 1000,
                            padding: 20,
                            fontColor: "#9e9e9e",
                        },
                    }],
                    xAxes: [{

                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        },
                    }]
                }
            }
        }
    }

    render() {
        let { data, options } = this.state
        return (
            <Card className="card-chart">
                <CardHeader>
                    <CardTitle tag="h3">每日生產件數</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-area">
                        <Bar data={data} options={options} />
                    </div>
                </CardBody>
            </Card>
        )
    }

}




class LineChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            data: (canvas) => {
                let ctx = canvas.getContext("2d");
                var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

                gradientStroke.addColorStop(1, "rgba(72,72,176,0.4)");
                gradientStroke.addColorStop(0.8, "rgba(72,72,176,0.2)");
                gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors
                return {
                    labels: props.date_list,
                    datasets: [
                        {
                            yAxisID: 'A',
                            label: "累積件數",
                            fill: true,
                            backgroundColor: gradientStroke,
                            borderColor: "#66ffff",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#66ffff",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#66ffff",
                            //pointHoverBorderColor:'rgba(35,46,55,1)',
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: props.data,
                        },

                        {
                            yAxisID: 'B',
                            label: "累積異常件數",
                            fill: true,
                            backgroundColor: gradientStroke,
                            borderColor: "red",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "red",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "red",
                            //pointHoverBorderColor:'rgba(35,46,55,1)',
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: props.continu_err_data_count,
                        },
                    ],
                };
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
                            fontColor: "#66ffff",
                        }, position: 'left', id: "A"
                    }, {
                        ticks: {
                            padding: 20,
                            fontColor: "red",
                        },
                        position: 'right', id: 'B'
                    }],
                    xAxes: [{
                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        }
                    }]
                }
            },
            laster_counter: props.laster_counter
        }
    }

    render() {
        let { data, options, laster_counter } = this.state
        return (
            <Card className="card-chart">
                <CardHeader>
                    <CardTitle tag="h3">產品正常/異常趨勢圖</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-area">
                        <Line data={data} options={options} />
                    </div>
                </CardBody>
            </Card>
        )
    }
}