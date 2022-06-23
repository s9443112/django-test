import React, { forwardRef } from 'react';



import * as request from '../../request/index'
import moment from 'moment'
import { Connector, subscribe, } from 'react-mqtt-client'

import { CardBody, Card, CardTitle, CardHeader, Row, Col, UncontrolledAlert } from 'reactstrap';

import { data } from 'jquery';
import { Bar, Line } from "react-chartjs-2";





export default class Fucker extends React.Component {
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

                            label: props.name,
                            fill: true,
                            backgroundColor: gradientStroke,
                            borderColor: props.color,
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: props.color,
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: props.color,
                            //pointHoverBorderColor:'rgba(35,46,55,1)',
                            pointBorderWidth: 0,
                            pointHoverRadius: 0,
                            pointHoverBorderWidth: 0,
                            pointRadius: 0,
                            data: props.data,
                        },


                    ],
                };
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "#f5f5f5",
                    titleFontColor: "#333",
                    bodyFontColor: "#666",
                    bodySpacing: 1,
                    xPadding: 2,
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
                            max: props.max,
                            min: props.min
                        },
                        position: 'left',
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
            <Card className="card-chart" >
                <CardHeader>
                    <CardTitle tag="h1" style={{fontWeight:'bold'}}>{this.props.name} {this.props.score}</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-area" style={{ height: "35vh" }}>
                        <Line data={data} options={options} />
                    </div>
                </CardBody>
            </Card>
        )
    }
}