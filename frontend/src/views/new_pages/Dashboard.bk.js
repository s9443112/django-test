import React, { forwardRef } from 'react';


import MaterialTable from '@material-table/core';
import * as request from '../../request/index'
import moment from 'moment'

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





export default class Dashboard extends React.Component {
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

        let { columns } = this.state
        let buffer
        let threshold_data = await request.get_setting()
        let dashboard_view = await request.get_dashboard_view()
        // console.log(dashboard_view)

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
                columns: columns
            })

            await this.do_something()

            this.timerId = setInterval((() =>
                this.do_something()
            ), 60000);
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

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    do_something = async () => {
        // ===================計算最後20筆資料=================//

        let start_time = moment(new Date()).subtract(1, 'hours').format("YYYY-MM-DD HH:mm:ss")
        let end_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

        // let start_time = "2021-10-15 11:02:51"
        // let end_time = "2021-10-15 13:02:51"

        let data = await request.get_toyo_history({

            limit: this.state.limit
        })
        data.map((ele) => {
            ele.timestamp = moment(new Date(ele.timestamp)).format("YYYY-MM-DD HH:mm:ss")
        })
        // console.log(data)
        let laster_counter = 0
        if (data.length !== 0) {
            laster_counter = data[0].counter
        } else {
            laster_counter = (await request.get_toyo_history({
                limit: this.state.limit
            }))[0].counter
        }
        this.setState({ data: data, laster_counter: laster_counter })


        // ===================計算今日件數=================//

        data = await request.get_toyo_count({
            start_time: moment(new Date()).format("YYYY-MM-DD"),
            end_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
        console.log(data)
        data = parseInt(data[0].count)

        this.setState({ today_count: data })



    }



    render() {

        let { columns, data, today_count, laster_counter, dangeralert } = this.state
        return (
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">壓鑄機 TOYO 即時生產資訊</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    {dangeralert}
                                    <Col lg="4" md="4">
                                        <Card className="card-stats" style={{ backgroundColor: '#6152a0' }}>
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12">
                                                        <CardTitle tag="h2">{'本日完成件數'}</CardTitle>
                                                    </Col>
                                                    <Col xs="12">
                                                        <CardTitle tag="h2">{today_count}</CardTitle>
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
                                                        <CardTitle tag="h2">{parseInt(today_count/10)}</CardTitle>
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
                                                        <CardTitle tag="h2">{laster_counter}</CardTitle>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col sm={12}>
                                        <MaterialTable
                                            icons={tableIcons}
                                            title="及時資料"
                                            columns={columns}
                                            data={data}
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
            </div>
        )
    }
}