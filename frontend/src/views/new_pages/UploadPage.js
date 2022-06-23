import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Container,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    UncontrolledAlert
} from "reactstrap";
import * as request from '../../request/index'
export default class UploadPage extends React.Component {

    onFileChange = (event) => {
        this.setState({file: event.target.files[0]})
    }
    submit = async()=>{
        console.log(this.state.file)
        let formData = new FormData()
        formData.append('filename', this.state.file)
        await request.uploadfile(formData)
        window.alert('成功匯入工單')
    }

    download = async()=>{
        
    }
    render() {
        return (
            <div className="content">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2">上傳工單列表</CardTitle>
                    </CardHeader>
                    <CardBody>


                        <Input type="file" name="fileToUpload" id="fileToUpload" onChange={this.onFileChange} />
                        <Button color="info" value="上傳檔案" name="submit" onClick={this.submit} block>上傳檔案</Button>

                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2">標準表格下載</CardTitle>
                    </CardHeader>
                    <CardBody>


                        <Button  color="info" name="submit" onClick={this.download} block>下載</Button>

                    </CardBody>
                </Card>
            </div>
        )
    }
}