import React, { forwardRef } from 'react';

import * as request from '../../request/index'
import ReactDatetime from "react-datetime";
import MaterialTable from '@material-table/core';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, Legend, ResponsiveContainer, Brush, CartesianGrid } from 'recharts';
import moment from 'moment'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Label,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    UncontrolledAlert
} from "reactstrap";
import { Pie } from "react-chartjs-2";

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

const ccc = {
    labels: ['Red', 'Green'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19],
            backgroundColor: [
                'rgba(255, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',

            ],
            borderColor: [
                'rgba(255, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',

            ],
            borderWidth: 1,
        },
    ],
};


export default class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            start_time: moment(new Date()).subtract(1, 'hours').format("YYYY-MM-DD HH:mm:ss"),
            end_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            data: [],
            search_col: [],
            data_col: []
        }
    }

    async componentDidMount() {
        try {
            let search_col = await request.get_table_col()
            if (search_col["type"] !== undefined) {
                throw "error"
            }
            let data = await request.get_setting()
            this.setState({ search_col: search_col, threshold_data: data, dangeralert: undefined })
        } catch (err) {
            this.setState({
                dangeralert: <Col sm={12}><UncontrolledAlert color="danger" fade={true}>
                    <span>
                        <b>Danger - </b>
                        無法正常取得歷史資料
                    </span>
                </UncontrolledAlert></Col>
            })
        }
    }

    SearchHistory = async () => {
        console.log({
            start_time: this.state.start_time,
            end_time: this.state.end_time
        })
        try {
            let data = await request.get_toyo_history({
                start_time: this.state.start_time,
                end_time: this.state.end_time
            })

            data.map((ele) => {
                ele.timestamp = moment(new Date(ele.timestamp)).format("YYYY-MM-DD HH:mm:ss")
            })
            // let pie_data = {}
            // this.state.data_col.map((ele) => {
            //     let piedata = []
            //     // console.log(ele)
            //     let buffer = {
            //         name: ele.title + ' 正常',
            //         english_parameter: ele.field,
            //         value: 0
            //     }
            //     let buffer2 = {
            //         name: ele.title + ' 異常',
            //         english_parameter: ele.field,
            //         value: 0
            //     }
            //     data.map((elee) => {
            //         // console.log(elee[ele.field])
            //         if (ele.upper_limit <= elee[ele.field] || ele.lower_limit >= elee[ele.field]) {
            //             buffer2.value = buffer2.value + 1
            //         } else {
            //             buffer.value = buffer.value + 1
            //         }
            //     })
            //     piedata.push(buffer)
            //     piedata.push(buffer2)
            //     pie_data[ele.field] = piedata
            // })
            // console.log(pie_data)
            let pie_data = []
            let good = 0
            let bad = 0
            this.state.data_col.map((ele) => {

                data.map((elee) => {
                    if (ele.upper_limit <= elee[ele.field] || ele.lower_limit >= elee[ele.field]) {
                        bad = bad + 1
                    } else {
                        good = good + 1
                    }
                })

                let buffer = {
                    labels: [`${ele.title} 異常`, `${ele.title} 正常`],
                    datasets: [
                        {
                            label: '# of Votes',
                            data: [bad, good],
                            backgroundColor: [
                                'rgba(255, 99, 132)',
                                'rgb(54, 162, 235)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }


                pie_data.push(buffer)
                good = 0
                bad = 0

            })



            this.setState({ tableform: <TableForm data={data} key={Math.random()} data_col={this.state.data_col} /> })
            this.setState({ drawfrom: <DrawFrom data={data} key={Math.random()} data_col={this.state.data_col} threshold_data={this.state.threshold_data} pie_data={pie_data} /> })
            this.setState({dangeralert: undefined})
        } catch (err) {
            this.setState({
                dangeralert: <Col sm={12}><UncontrolledAlert color="danger" fade={true}>
                    <span>
                        <b>Danger - </b>
                        無法搜尋歷史資料
                    </span>
                </UncontrolledAlert></Col>
            })
        }
    }

    colList = async (col) => {

        let buffer_data_col = this.state.data_col
        let buffer = buffer_data_col.findIndex(ele => ele.field === col.english_parameter)

        if (buffer === -1) {
            let buffer2 = this.state.threshold_data.find(ele => ele.english_parameter === col.english_parameter)
            buffer_data_col.push({
                title: col.chinese_parameter,
                field: col.english_parameter,
                upper_limit: buffer2.upper_limit,
                lower_limit: buffer2.lower_limit,
                cellStyle: rowData => {

                    // console.log(buffer2)
                    if (rowData >= buffer2.upper_limit || rowData <= buffer2.lower_limit) {
                        return { color: 'red' }
                    }
                }
            })
        } else {
            buffer_data_col.splice(buffer, 1)
        }
        console.log(buffer_data_col)
        this.setState({ data_col: buffer_data_col })
    }

    render() {
        let { start_time, end_time, search_col, tableform, drawfrom, dangeralert } = this.state
        return (
            <div className="content">
                <Row>
                    {dangeralert}
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">使用者自定義歷史查詢</CardTitle>
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
                                            dateFormat={"YYYY-MM-DD HH:mm:ss"}
                                            initialValue={start_time}
                                            onChange={(e) => { this.setState({ start_time: moment(e).format('YYYY-MM-DD HH:mm:ss') }) }}
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
                                            dateFormat={"YYYY-MM-DD HH:mm:ss"}
                                            initialValue={end_time}
                                            onChange={(e) => { this.setState({ end_time: moment(e).format('YYYY-MM-DD HH:mm:ss') }) }}
                                        />
                                    </FormGroup>

                                    <Label sm="2"></Label>
                                    <Row>


                                        {search_col.map((ele, d) => {
                                            return (
                                                <Col sm="2" key={`col ${d}`}>
                                                    <FormGroup check inline >
                                                        <Label check style={{ fontSize: '14px' }}>
                                                            <Input type="checkbox" onClick={() => this.colList(ele)} />
                                                            <span className="form-check-sign" />{ele.chinese_parameter}

                                                        </Label>
                                                    </FormGroup>
                                                </Col>
                                            )
                                        })}


                                    </Row>

                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="btn-fill" color="primary" type="submit" onClick={this.SearchHistory}>
                                    送出
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col sm={12}>
                        {drawfrom}
                    </Col>

                    <Col sm={12}>
                        {tableform}
                    </Col>
                </Row>
            </div>
        )
    }
}

class DrawFrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            data_col: props.data_col,
            threshold_data: props.threshold_data,
            pie_data: props.pie_data
        }
    }
    async componentDidMount() {
        // console.log(this.state.data_col)
    }
    render() {
        let { data_col, data, threshold_data, pie_data } = this.state
        console.log(pie_data)
        // console.log(data)
        // console.log(threshold_data)
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2">參數異常歷程顯示</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        {data_col.map((ele, d) => {
                            // console.log(ele.field)
                            // console.log(threshold_data)
                            // console.log(threshold_data.find(elee => console.log(elee.english_parameter)))
                            return (
                                <>
                                    <Col sm={6} key={`draw ${d}`}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}>
                                            <LineChart

                                                data={data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <XAxis dataKey="timestamp" height={70} angle={-15}
                                                    textAnchor="end" />
                                                <YAxis domain={['auto', 'auto']} />
                                                <Tooltip />
                                                <Legend />

                                                <Line type="monotone" dataKey={`${ele.field}`} stroke="#2299FF" dot={false} />
                                                <CartesianGrid strokeDasharray="3 3" />


                                                <ReferenceLine y={(threshold_data.find(elee => elee.english_parameter === ele.field)).upper_limit} label={{ value: 'Max ', fill: 'red', position: "top" }} stroke="red" />
                                                <ReferenceLine y={(threshold_data.find(elee => elee.english_parameter === ele.field)).lower_limit} label={{ value: 'Min ', fill: 'red', position: "top" }} stroke="red" />

                                                <Brush
                                                    dataKey="timestamp"
                                                    height={30}
                                                    stroke="#8884d8"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Col>
                                    <Col sm={6} >
                                        <Pie data={pie_data[d]} width={400} options={{
                                            legend: {
                                                display: true,
                                                labels: {
                                                    fontSize: 18,
                                                },
                                            },
                                            responsive: true,



                                        }} />
                                    </Col>
                                    <hr style={{ color: 'white', backgroundColor: 'white' }} />
                                </>



                            )
                        })}

                    </Row>
                </CardBody>
            </Card>
        )
    }
}

class TableForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "流水號", field: "sn" },
                { title: "時間", field: "timestamp" },
            ],
            data: props.data
        }
    }

    async componentDidMount() {
        let { columns } = this.state

        columns = columns.concat(this.props.data_col);
        this.setState({ columns: columns })


    }

    render() {
        let { columns, data } = this.state
        return (
            <div className="content">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2">歷史原始資料</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <MaterialTable
                            icons={tableIcons}
                            title="歷史原始資料"
                            columns={columns}
                            data={data}
                            options={{
                                sorting: true,

                            }}
                        />
                    </CardBody>
                </Card>
            </div>

        );
    }
}