import React, { forwardRef } from 'react';
import MaterialTable from '@material-table/core';
import * as request from '../../request/index'
import moment from 'moment';

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

export default class DeviceBook extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "????????????", field: "name" },
                { title: "???????????????", field: "user" },
                { title: "?????????", field: "client_id", editable: "never", },

                // { title: "??????1", field: "dispatch_second", lookup: {} },
                // { title: "??????2", field: "dispatch_third", lookup: {} },
                { title: "?????????", field: "dispatch_first", lookup: {}, editable: "never" },
                { title: "????????????", field: "date_time", editable: "never", },
                // { title: "?????????", field: "client_id",  editable: "never", },
                // { title: "??????", field: "lower_limit", type: 'numeric' },
                // { title: "?????????", field: "english_parameter", editable: "never", },
            ],
            data: [],
            columns2: [
                { title: "??????", field: "name" },
                { title: "??????", field: "auth", lookup: { 1: '??????', 2: '??????', 3: '???????????????' }, },
                { title: "??????", field: "email" },
                // { title: "??????", field: "account" },
                // { title: "??????", field: "password" },
            ],
            data2: []
        }
    }

    do_something = async () => {
        let { columns } = this.state
        let data = await request.get_devices()
        data.sort(this.compare_datetime)
        console.log(data)
        data.map((ele, d) => {
            ele.date_time = moment(new Date(ele.date_time)).format("YYYY-MM-DD HH:mm:ss")
        })
        this.setState({ data: data })

        let users = await request.get_users()
        this.setState({ data2: users })
        console.log(users)


        let user_lookup = {}

        users.map((ele,d)=>{
            user_lookup[ele.id] = ele.name
        })
        columns[1].lookup = user_lookup
        this.setState({columns: columns})

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



    async componentDidMount() {
        // await this.get_user()
        let { columns } = this.state
        console.log(columns)
        await this.do_something()

        let dispatch = await request.get_dispatch_by_status(0)
        let dispatch_doing = await request.get_dispatch_by_status(1)

        dispatch.push.apply(dispatch, dispatch_doing)
        let lookup = {}
        console.log(dispatch)
        dispatch.map((ele) => {
            lookup[ele.dispatchNumber] = `??????: ${ele.dispatchNumber} / ???????????????: ${ele.qt_count} / ????????????: ${ele.real_count}`
        })
        columns[3].lookup = lookup
        // columns[3].lookup = lookup
        // columns[4].lookup = lookup
        this.setState({
            columns: columns
        })
        
    }


    render() {
        let { data, columns, data2, columns2 } = this.state
        return (
            <div className="content">
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">????????????</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <MaterialTable
                                    icons={tableIcons}
                                    title="????????????"
                                    columns={columns}
                                    data={data}
                                    localization={{
                                        header: {
                                            actions: '??????'
                                        },
                                    }}
                                    editable={{
                                        onRowUpdate: (newData, oldData) =>
                                            new Promise((resolve, reject) => {
                                                setTimeout(async () => {
                                                    console.log(newData)
                                                    await request.put_devices(newData.id, newData)
                                                    // await request.modify_setting(newData)
                                                    await this.do_something()
                                                    resolve();
                                                }, 600);
                                            })
                                    }}
                                    options={{
                                        sorting: true,

                                    }}
                                />
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">????????????</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <MaterialTable
                                    icons={tableIcons}
                                    title="???????????????"
                                    columns={columns2}
                                    data={data2}
                                    localization={{
                                        header: {
                                            actions: '??????'
                                        },
                                    }}
                                    editable={{
                                        onRowAdd: newData =>
                                            new Promise(async (resolve, reject) => {
                                                // console.log(newData)
                                                setTimeout(async () => {
                                                    await request.post_users(newData)
                                                    await this.do_something()
                                                    resolve()
                                                }, 600)
                                            }),
                                        onRowUpdate: (newData, oldData) =>
                                            new Promise((resolve, reject) => {
                                                setTimeout(async () => {
                                                    console.log(newData)
                                                    await request.put_users(newData.id, newData)
                                                    // await request.modify_setting(newData)
                                                    await this.do_something()
                                                    resolve();
                                                }, 600);
                                            })
                                    }}
                                    options={{
                                        sorting: true,

                                    }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
