import moment from 'moment';
import React, { forwardRef } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Collapse,
    ModalBody,
    FormGroup,
    Modal,
    Input,
    Row,
    Col,
    Label
} from "reactstrap";
import * as request from '../../request/index'
export default class DispatchDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: undefined,
            devices: [],
            select_devices: [],
            modalClassic: false,
            free: false,
            nofree: false
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
        // console.log(dispatch)
        let default_publish_count = parseInt(dispatch.qt_count * 0.8)
        dispatch.publish_count = default_publish_count
        this.setState({ dispatch: dispatch })
        await this.get_device()
    }

    get_device = async () => {
        // let devices = []
        let device = await request.get_devices()
        device.sort(this.compare_datetime)

        this.setState({ devices: device })
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
        let buffer = select_devices.findIndex(ele => ele.client_id === col.client_id)

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

    send_form = async () => {
        let { dispatch, select_devices } = this.state
        this.toggleModalClassic()

        let devices_first = []
        select_devices.map((ele) => {
            devices_first.push(ele.id)
        })
        devices_first = devices_first.toString()
        let data = {
            devices_first: devices_first,
            dispatchNumber: dispatch.dispatchNumber,
            publish_count: dispatch.publish_count
        }
        console.log(data)

        if (data.devices_first === '') {
            window.alert("錯誤 請確認再次派工設備")
            return
        }

        let result = await request.start_dispatch(data)
        window.alert("派工成功")
        setTimeout(function () { window.location.href = '/admin/dispatchlist' }, 1500);
        console.log(result)

    }

    render() {
        let { dispatch, devices, modalClassic, select_devices } = this.state
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
                                        <h4>實際開工日: {dispatch.real_start_date !== null ? moment(dispatch.real_start_date).format("YYYY-MM-DD HH:mm:ss") : '未開工'}</h4>
                                        <h4>實際完工日: {dispatch.real_end_date !== null ? moment(dispatch.real_end_date).format("YYYY-MM-DD HH:mm:ss") : '未完工'}</h4>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card style={{ WebkitFilter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))", filter: "drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.7))" }}>
                                    <CardBody>
                                        <Row>
                                            <Col md={12}>
                                                <h4>進度水位設定</h4>
                                                <FormGroup>
                                                    <Input type="number" defaultValue={dispatch.publish_count} onChange={(e) => {
                                                        let { dispatch } = this.state
                                                        dispatch.publish_count = e.target.value
                                                        this.setState({ dispatch: dispatch })
                                                        // console.log(e.target.value)
                                                    }} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={12}>
                                                <h4>可用數位計數器列表</h4>
                                            </Col>
                                            {/* {devices.map((ele,d) => {
                                                // console.log(ele.dispatch_first)
                                                return (
                                                    <Col md={12} key={`device ${d}`}>
                                                        <FormGroup check inline disabled={ele.dispatch_first === null ? false : true}>
                                                            <Label check style={{ fontSize: '14px' }}>
                                                                <Input type="checkbox" onClick={() => this.colList(ele)} disabled={ele.dispatch_first === null ? false : true} />
                                                                <span className="form-check-sign" />{ele.name} / {ele.client_id}

                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                )
                                            })} */}

                                            <Col md={12}>
                                                <div
                                                    aria-multiselectable={true}
                                                    className="card-collapse"
                                                    id="accordion"
                                                    role="tablist"
                                                >
                                                    <Card className="card-plain">
                                                        <CardHeader role="tab">
                                                            <a
                                                                aria-expanded={this.state.free}
                                                                href="#pablo"
                                                                data-parent="#accordion"
                                                                data-toggle="collapse"
                                                                onClick={(e) => {
                                                                    e.preventDefault();

                                                                    this.setState({ free: !this.state.free })
                                                                }}
                                                            >
                                                                閒置中數位計數器{" "}
                                                                <i className="tim-icons icon-minimal-down" />
                                                            </a>
                                                        </CardHeader>
                                                        <Collapse role="tabpanel" isOpen={this.state.free}>
                                                            <CardBody>
                                                                {devices.map((ele, d) => {

                                                                    if (ele.dispatch_first === null) {
                                                                        return (
                                                                            <Col md={12} key={`device ${d}`}>
                                                                                <FormGroup check inline disabled={ele.dispatch_first === null ? false : true}>
                                                                                    <Label check style={{ fontSize: '14px' }}>
                                                                                        <Input type="checkbox" onClick={() => this.colList(ele)} disabled={ele.dispatch_first === null ? false : true} />
                                                                                        <span className="form-check-sign" />{ele.name} / {ele.client_id}

                                                                                    </Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        )
                                                                    }
                                                                    // console.log(ele.dispatch_first)

                                                                })}
                                                            </CardBody>
                                                        </Collapse>
                                                    </Card>
                                                    <Card className="card-plain">
                                                        <CardHeader role="tab">
                                                            <a
                                                                aria-expanded={this.state.nofree}
                                                                href="#pablo"
                                                                data-parent="#accordion"
                                                                data-toggle="collapse"
                                                                onClick={(e) => {
                                                                    e.preventDefault();

                                                                    this.setState({ nofree: !this.state.nofree })
                                                                }}
                                                            >
                                                                忙碌中數位計數器{" "}
                                                                <i className="tim-icons icon-minimal-down" />
                                                            </a>
                                                        </CardHeader>
                                                        <Collapse role="tabpanel" isOpen={this.state.nofree}>
                                                            <CardBody>
                                                                {devices.map((ele, d) => {
                                                                    // console.log(ele.dispatch_first)
                                                                    if (ele.dispatch_first !== null) {
                                                                        return (
                                                                            <Col md={12} key={`device ${d}`}>
                                                                                <FormGroup check inline disabled={ele.dispatch_first === null ? false : true}>
                                                                                    <Label check style={{ fontSize: '14px' }}>
                                                                                        <Input type="checkbox" onClick={() => this.colList(ele)} disabled={ele.dispatch_first === null ? false : true} />
                                                                                        <span className="form-check-sign" />{ele.name} / {ele.client_id}

                                                                                    </Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        )
                                                                    }
                                                                })}
                                                            </CardBody>
                                                        </Collapse>
                                                    </Card>
                                                </div>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Button onClick={this.toggleModalClassic} >確認派工</Button>
                            </Col>
                        </Row>

                        {/* Classic Modal */}
                        <Modal isOpen={modalClassic} toggle={this.toggleModalClassic}>
                            <div className="modal-header justify-content-center">
                                <button
                                    aria-hidden={true}
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={this.toggleModalClassic}
                                >
                                    <i className="tim-icons icon-simple-remove" />
                                </button>
                                <h6 className="title title-up">再次確認</h6>
                            </div>
                            <ModalBody >
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
                                        {select_devices.map((ele) => {
                                            console.log(ele)
                                            return (
                                                <h4>工作設備: {ele.name}</h4>
                                            )
                                        })}
                                    </CardBody>
                                </Card>
                            </ModalBody>
                            <div className="modal-footer">
                                <Button
                                    color="default"
                                    type="button"
                                    onClick={this.send_form}
                                >
                                    確認
                                </Button>
                                <Button
                                    color="danger"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={this.toggleModalClassic}
                                >
                                    取消
                                </Button>
                            </div>
                        </Modal>

                    </div>
                }
            </>
        )
    }
}