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
import { CardBody, Card, CardTitle, CardHeader, Row, Col, UncontrolledAlert, Button } from 'reactstrap';


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


export default class DispatchList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: "部門", field: "department" },
                { title: "工單編號", field: "dispatchNumber" },
                { title: "預計開工日", field: "guess_start_date" },
                { title: "預計完工日", field: "guess_end_date" },
                { title: "建立日期", field: "generate_start_date" },
                { title: "料件編號", field: "material_code" },
                { title: "品名", field: "product_name" },
                { title: "規格", field: "specification" },
                { title: "應完成數量", field: "qt_count" },
                { title: "狀態", field: "status" },
                {
                    title: "派工", field: "id", render: (ele) => {
                        // console.log(ele)
                        return (<a href={`/admin/dispatch?id=${ele.id}`}><Button>派工</Button></a>)
                    }
                },
            ],
            data: []
        }
    }

    async componentDidMount() {
        // await this.get_user()
        await this.do_something()
    }

    do_something = async () => {
        let dispatchlist = await request.get_dispatch_by_status(0)
        dispatchlist.map((ele)=>{
            ele.real_start_date = moment(new Date(ele.real_start_date)).format("YYYY-MM-DD")
            ele.real_end_date = moment(new Date(ele.real_end_date)).format("YYYY-MM-DD")
            ele.guess_start_date = moment(new Date(ele.guess_start_date)).format("YYYY-MM-DD")
            ele.guess_end_date = moment(new Date(ele.guess_end_date)).format("YYYY-MM-DD")
            ele.generate_start_date = moment(new Date(ele.generate_start_date)).format("YYYY-MM-DD")
        })
        this.setState({ data: dispatchlist })
    }
    render() {
        let { columns, data } = this.state
        return (
            <div className="content">
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2">工單列表</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <MaterialTable
                                    icons={tableIcons}
                                    title="工單列表"
                                    columns={columns}
                                    data={data}
                                    localization={{
                                        header: {
                                            actions: '操作'
                                        },
                                    }}
                                    style={{ backgroundColor: '#27293d' }}
                                    editable={{


                                        // onRowUpdate: (newData, oldData) =>
                                        //     new Promise((resolve, reject) => {
                                        //         setTimeout(async () => {
                                        //             console.log(newData)
                                        //             await request.modify_setting(newData)
                                        //             await this.do_something()
                                        //             resolve();
                                        //         }, 600);
                                        //     }),



                                    }}
                                    options={{
                                        sorting: true,
                                        headerStyle: {
                                            backgroundColor: '#27293d',
                                            color: '#FFF'
                                        },
                                        rowStyle: {
                                            color: '#FFF',
                                            fontSize:'18px'
                                        },
                                        actionsCellStyle:{
                                            color: '#FFF',
                                            fontSize:'18px'
                                        },
                                        searchFieldStyle:{
                                            color: '#FFF'
                                        },
                                        editCellStyle:{
                                            color: '#FFF'
                                        }
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