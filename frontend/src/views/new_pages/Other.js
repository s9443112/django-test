import React, { forwardRef } from 'react';


import MaterialTable from '@material-table/core';
import * as request from '../../request/index'
import moment from 'moment'
import { Connector, subscribe, } from 'react-mqtt-client'
import Fucker from './fucker'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { CardBody, Card, CardTitle, CardHeader, Row, Col, UncontrolledAlert } from 'reactstrap';




export default class Other extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            today_count: 0,
            laster_counter: 0,
            limit: 20,
            columns: [
                { title: "流水號", field: "sn" },
                { title: "時間", field: "timestamp" },
            ]
        }
    }

    async componentDidMount() {
        // await this.do_something()

        // this.timerId = setInterval((() =>
        //     this.do_something()
        // ), 60000);

    }

    


    render() {

        let { today_count, laster_counter, dangeralert, allcount, errcount } = this.state
        return (
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            
                            <CardBody>
                                <Row>
                                    {dangeralert}
                                    
                                    <Col sm={12}>
                                        <App />
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>

                </Row>
            </div>
        )
    }
}



class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Connector
                    mqttProps={{
                        url: `ws://${process.env.REACT_APP_MQTT_SERVER}`,
                        options: { protocol: 'ws', port: process.env.REACT_APP_MQTT_PORT, username: process.env.REACT_APP_MQTT_ACC, password: process.env.REACT_APP_MQTT_PWD },
                    }}
                >
                    <Connected />
                </Connector>
            </React.Fragment>
        )
    }
}

let current_list = []
let shake_list = []
let humidity_list = []
let temp_list = []

let date_list = []

const MessageList = props => {

    let x = JSON.parse(JSON.stringify(props.data))
    props.data.splice(0, 1)
    // console.log(x[0])

    let current = 0
    let shake = 0
    let humidity = 0
    let temp = 0
    


    if (x[0] !== undefined) {

        let data = x[0]
        
        if (data.length === undefined) {
            current = 0
            shake = 0
            humidity = 0
            temp = 0
            
            current_list = []
            shake_list = []
            humidity_list = []
            temp_list = []
           
            date_list = []

        } else {

            data= data.split(',')
            // console.log(data)

            current = parseInt(data[1])
            shake = parseInt(data[2])
            humidity = parseInt(data[3])
            temp = parseInt(data[4])

            current_list.push(parseInt(data[1]))
            shake_list.push(parseInt(data[2]))
            humidity_list.push(parseInt(data[3]))
            temp_list.push(parseInt(data[4]))
            date_list.push(moment(data[0]).format("HH:mm:ss"))

         
            console.log(current_list.length)
            if (current_list.length >= 1000) {

                current_list.splice(0,1000)
                shake_list.splice(0, 1000)
                humidity_list.splice(0, 1000)
                temp_list.splice(0, 1000)
               

                date_list.splice(0, 1000)

                // current_list.splice(0,1)
                // shake_list.splice(0, 1)
                // humidity_list.splice(0, 1)
                // temp_list.splice(0, 1)
               

                // date_list.splice(0, 1)
                
                // current_list.splice(0, current_list.length - 100)
                // shake_list.splice(0, shake_list.length - 100)
                // humidity_list.splice(0, humidity_list.length - 100)
                // temp_list.splice(0, temp_list.length - 100)
               

                // date_list.splice(0, date_list.length - 100)
            }

        }

    }

    // console.log(current_list)





    return (
        <Row>
            <Col lg={6} >
                <Fucker
                    score={current}
                    data={current_list}
                    date_list={date_list}
                    color={'#FF9224'}
                    name={'電流'}
                    min={1000}
                    max={2000}
                />
            </Col>
            <Col lg={6} >
                <Fucker
                    score={shake}
                    data={shake_list}
                    date_list={date_list}
                    color={'#53FF53'}
                    name={'震動'}
                    min={1000}
                    max={2000}
                />
            </Col>
            <Col lg={6} >
                <Fucker
                    score={humidity}
                    data={humidity_list}
                    date_list={date_list}
                    color={'#EA0000'}
                    name={'濕度'}
                    min={0}
                    max={100}
                />
            </Col>
            <Col lg={6} >
                <Fucker
                    score={temp}
                    data={temp_list}
                    date_list={date_list}
                    color={'#FF359A'}
                    name={'溫度'}
                    min={0}
                    max={60}
                />
            </Col>
           
        </Row>
    )


}

const Connected = subscribe({ topic: 'Sub1_Raw_Data' })(MessageList)