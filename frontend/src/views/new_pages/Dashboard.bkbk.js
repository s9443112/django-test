import React, { forwardRef } from 'react';


import MaterialTable from '@material-table/core';
import * as request from '../../request/index'
import moment from 'moment'
import { Connector, subscribe, } from 'react-mqtt-client'
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
import {
    CardBody, Card, CardTitle, CardHeader, Row, Col, UncontrolledAlert, NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane,
} from 'reactstrap';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

let columns = [{ title: "流水號", field: "sn" },
{ title: "時間", field: "timestamp" },]



export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            today_count: 0,
            laster_counter: 0,
            limit: 20,
            device_list: [],
            pageTabs: 'toyo',

        }
    }

    async componentDidMount() {


        let buffer
        let threshold_data = await request.get_setting()
        let dashboard_view = await request.get_dashboard_view()
        let device_list = await request.get_device()
        // console.log(dashboard_view)
        this.setState({
            // columns: columns,
            device_list: device_list
        })
        try {
            dashboard_view.map((ele) => {

                new Promise(async (resolve, reject) => {
                    buffer = await threshold_data.find(elee => elee.english_parameter === ele.args)
                    resolve(buffer)
                }).then((buffer) => {

                    if (buffer !== undefined) {

                        columns.push({
                            title: ele.name,
                            field: ele.args,
                            cellStyle: rowData => {
                                if (rowData >= buffer.upper_limit || rowData <= buffer.lower_limit) {
                                    return { color: 'red' }
                                }
                            }
                        })
                    } else {
                        columns.push({
                            title: ele.name,
                            field: ele.args
                        })
                    }
                })


            })

            this.setState({
                dangeralert: undefined
            })
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

        let { dangeralert, device_list, pageTabs } = this.state
        return (
            <div className="content">
                {dangeralert}
                <Row>
                    <Col md="12">
                        <Card >
                            <CardHeader>
                                <CardTitle tag="h2">即時生產資訊</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {/* color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger" */}
                                <Row>
                                    <Col md="1">
                                        <Nav className="nav-pills-info flex-column" pills>

                                            {device_list.map((ele, d) => {
                                                return (
                                                    <NavItem key={`nav ${d}`}>
                                                        <NavLink
                                                            data-toggle="tab"
                                                            href="#pablo"
                                                            className={pageTabs === ele.table_name ? "active" : ""}
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                this.setState({ pageTabs: ele.table_name })
                                                            }}
                                                        >

                                                            {ele.name}
                                                        </NavLink>
                                                    </NavItem>
                                                )
                                            })}



                                        </Nav>
                                    </Col>
                                    <Col md="11">
                                        <TabContent
                                            className="tab-space tab-subcategories"
                                            activeTab={pageTabs}
                                        >

                                            {device_list.map((ele, d) => {
                                                return (
                                                    <TabPane tabId={ele.table_name} key={`tab ${d}`}>
                                                        <App topic={ele.table_name} />
                                                    </TabPane>
                                                )

                                            })}

                                            {/* <TabPane tabId="messages">
                                                Efficiently unleash cross-media information without
                                                cross-media value. Quickly maximize timely deliverables for
                                                real-time schemas. <br />
                                                <br />
                                                Dramatically maintain clicks-and-mortar solutions without
                                                functional solutions.
                                            </TabPane> */}

                                        </TabContent>
                                    </Col></Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>




            </div>
        )
    }
}


class App extends React.Component {

    componentDidMount() {
        console.log(this.props.topic)
    }

    render() {

        return (
            <React.Fragment>
                <Connector
                    mqttProps={{
                        url: `ws://${process.env.REACT_APP_MQTT_SERVER}`,
                        options: { protocol: 'ws', port: process.env.REACT_APP_MQTT_PORT, username: process.env.REACT_APP_MQTT_ACC, password: process.env.REACT_APP_MQTT_PWD },
                    }}
                >
                    <Connected topic={this.props.topic} />

                </Connector>
            </React.Fragment>
        )
    }
}

let mq_data = {
    history: [],
    laster_counter: 0,
    today_count: 0
}

const MessageList = props => {

    let x = JSON.parse(JSON.stringify(props.data))

    props.data.splice(0, 1)
    console.log(x)
    if (x[0] !== undefined) {

        mq_data = x[0]

    } 
    // console.log(columns)
    // console.log(mq_data)

    return (

        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h3">壓鑄機</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>

                            <Col lg="4" md="4">
                                <Card className="card-stats" style={{ backgroundColor: '#6152a0' }}>
                                    <CardBody>
                                        <Row>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{'本日完成件數'}</CardTitle>
                                            </Col>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{mq_data.today_count}</CardTitle>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg="4" md="4">
                                <Card className="card-stats" style={{ backgroundColor: '#774e94' }}>
                                    <CardBody>
                                        <Row>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{'本日警報統計'}</CardTitle>
                                            </Col>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{0}</CardTitle>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg="4" md="4">
                                <Card className="card-stats" style={{ backgroundColor: '#a75395' }}>
                                    <CardBody>
                                        <Row>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{'累積生產件數'}</CardTitle>
                                            </Col>
                                            <Col xs="12">
                                                <CardTitle tag="h2">{mq_data.laster_counter}</CardTitle>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col sm={12}>
                                <MaterialTable
                                    icons={tableIcons}
                                    title="即時資料"
                                    columns={columns}
                                    data={mq_data.history}
                                    options={{
                                        sorting: true,
                                        rowStyle: { fontSize: 22 },
                                        headerStyle: { fontSize: 18 }
                                    }}
                                />
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Col>
            <Col md={4}>
            </Col>

        </Row>
    )


}

let Connected = subscribe({ topic: 'toyo' })(MessageList)
