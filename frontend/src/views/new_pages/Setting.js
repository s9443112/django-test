import React, { forwardRef } from 'react';
import moment from 'moment'

import MaterialTable from '@material-table/core';
import * as request from '../../request/index'


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


export default class Setting extends React.Component {
    render() {
        return (
            <div className="content">
                <Row>
                    <Col sm={12}>
                        <Threshold />
                    </Col>
                    <Col sm={12}>
                        <DashboardView />
                    </Col>
                    <Col sm={12}>
                        <DeviceView />
                    </Col>
                </Row>
            </div>
        )
    }
}



class Threshold extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "名稱", field: "chinese_parameter" },
                { title: "上限", field: "upper_limit", type: 'numeric' },
                { title: "下限", field: "lower_limit", type: 'numeric' },
                { title: "參考值", field: "english_parameter", editable: "never", },
            ],
            data: []
        }
    }



    do_something = async () => {
        try {
            let data = await request.get_setting()
            console.log(data)
            if (data["type"] !== undefined) {
                throw "error"
            }
            this.setState({ data: data, dangeralert: undefined })
        } catch (err) {

            this.setState({
                dangeralert: <Col sm={12}><UncontrolledAlert color="danger" fade={true}>
                    <span>
                        <b>Danger - </b>
                        無法正常取得警戒值資料
                    </span>
                </UncontrolledAlert></Col>
            })
        }

    }

    async componentDidMount() {
        // await this.get_user()
        await this.do_something()
    }

    render() {
        let { columns, data, dangeralert } = this.state
        return (

            <Card>
                <CardHeader>
                    <CardTitle tag="h2">警戒值設定</CardTitle>
                </CardHeader>
                <CardBody>
                    {dangeralert}
                    <MaterialTable
                        icons={tableIcons}
                        title="警戒值設定"
                        columns={columns}
                        data={data}
                        localization={{
                            header: {
                                actions: '操作'
                            },
                        }}
                        editable={{


                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        console.log(newData)
                                        await request.modify_setting(newData)
                                        await this.do_something()
                                        resolve();
                                    }, 600);
                                }),



                        }}
                        options={{
                            sorting: true,

                        }}


                    />
                </CardBody>
            </Card>



        );
    }
}


class DashboardView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "名稱", field: "args" },
            ],
            data: []
        }
    }

    do_something = async () => {
        let data = await request.get_dashboard_view()
        this.setState({ data: data })
    }

    async componentDidMount() {
        await this.do_something()

        try {
            let table_col = await request.get_table_col()
            let lookup = {}
            table_col.map((ele) => {
                lookup[ele.english_parameter] = `${ele.chinese_parameter} ${ele.english_parameter}`
            })

            // console.log(table_col)
            let buffer = this.state.columns
            buffer[0]["lookup"] = lookup
            this.setState({ columns: buffer, table_col: table_col, dangeralert: undefined })
        } catch (err) {
            this.setState({
                dangeralert: <Col sm={12}><UncontrolledAlert color="danger" fade={true}>
                    <span>
                        <b>Danger - </b>
                        無法正常取得參數資料
                    </span>
                </UncontrolledAlert></Col>
            })
        }
    }


    render() {
        let { columns, data, dangeralert } = this.state
        return (

            <Card>
                <CardHeader>
                    <CardTitle tag="h2">戰情看板設定</CardTitle>
                </CardHeader>
                <CardBody>
                    {dangeralert}
                    <MaterialTable
                        icons={tableIcons}
                        title="戰情看板設定"
                        columns={columns}
                        data={data}
                        localization={{
                            header: {
                                actions: '操作'
                            },
                        }}
                        editable={{

                            onRowAdd: newData =>
                                new Promise(async (resolve, reject) => {
                                    // console.log(newData)
                                    setTimeout(async () => {
                                        let check = this.state.data.find(ele => ele.args === newData.args)
                                        if (check !== -1) {
                                            reject()
                                        }

                                        let table_col = this.state.table_col.find(ele => ele.english_parameter === newData.args)
                                        await request.insert_dashboard_view({
                                            name: table_col.chinese_parameter,
                                            args: table_col.english_parameter
                                        })
                                        await this.do_something()
                                        resolve()


                                    }, 600)


                                }),

                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        let check = this.state.data.find(ele => ele.args === newData.args)
                                        if (check !== -1) {
                                            reject()
                                        }
                                        let table_col = this.state.table_col.find(ele => ele.english_parameter === newData.args)
                                        await request.update_dashboard_view({
                                            old_args: oldData.args,
                                            name: table_col.chinese_parameter,
                                            args: table_col.english_parameter
                                        })
                                        await this.do_something()
                                        resolve();
                                    }, 600);
                                }),

                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(async () => {

                                        await request.delete_dashboard_view(oldData)
                                        await this.do_something()
                                        resolve();
                                    }, 600);
                                }),
                        }}
                        options={{
                            sorting: true,

                        }}


                    />
                </CardBody>
            </Card>



        );
    }
}


class DeviceView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "設備名稱", field: "name" },
                { title: "設備描述", field: "describe" },
                { title: "設備資料表", field: "table_name" },
                { title: "建立時間", field: "create_time", editable: "never" },
            ],
            data: []
        }
    }

    do_something = async () => {
        let data = await request.get_device()
        data.map((ele) => {
            ele.create_time = moment(new Date(ele.create_time)).format("YYYY-MM-DD HH:mm:ss")
        })
        this.setState({ data: data })
    }

    async componentDidMount() {
        await this.do_something()
    }


    render() {
        let { columns, data, dangeralert } = this.state
        return (

            <Card>
                <CardHeader>
                    <CardTitle tag="h2">設備設定</CardTitle>
                </CardHeader>
                <CardBody>
                    {dangeralert}
                    <MaterialTable
                        icons={tableIcons}
                        title="設備設定"
                        columns={columns}
                        data={data}
                        localization={{
                            header: {
                                actions: '操作'
                            },
                        }}
                        editable={{

                            onRowAdd: newData =>
                                new Promise(async (resolve, reject) => {
                                    // console.log(newData)
                                    setTimeout(async () => {

                                        await request.insert_device(newData)
                                        await this.do_something()
                                        resolve()


                                    }, 600)


                                }),

                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        newData["device_id"] = oldData.device_id
                                        await request.update_device(newData)
                                        await this.do_something()
                                        resolve();
                                    }, 600);
                                }),

                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(async () => {

                                        await request.delete_device(oldData)
                                        await this.do_something()
                                        resolve();
                                    }, 600);
                                }),
                        }}
                        options={{
                            sorting: true,

                        }}


                    />
                </CardBody>
            </Card>



        );
    }
}





