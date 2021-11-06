import React, { Component } from 'react'

import { Upload, Modal, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

var COS = require('cos-js-sdk-v5');
const cos = new COS({
    getAuthorization: function (options, callback) {
        axios.post(`/server/sts.php`,
            {
                params: {
                    bucket: options.Bucket,
                    region: options.Region,
                }
            }
        ).then(
            ({ data: response }) => {      //response的解构赋值？ 相当于 response= response.data

                var credentials = response && response.credentials;
                if (!response || !credentials) return console.error('证书无效');

                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    SecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: response.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: response.expiredTime, // 时间戳，单位秒，如：1580000900
                });
            },
            error => {

            }
        )

    }
});

export default class index extends Component {

    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    };

    componentDidMount(){
        this.getbgimg()
    }

    getbgimg = () => {  //获取表盘背景图
        axios.post('https://www.standpoint.top/api/brserver/selectdb.php',
            `name=${localStorage.getItem('login_user')}&action=selectbgimg`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    "Authorization": localStorage.getItem('jwt')
                }
            }

        ).then(
            response => {
                if (response.data.code === 1) {
                    let bgimglist = [];
                    response.data.data.data.forEach((item) => {
                        bgimglist.push(
                            {
                                uid: item.id,
                                name: item.imgname,
                                status: 'done',
                                url: item.imgurl,
                            }
                        )
                    })

                    this.setState({
                        fileList:bgimglist
                    })
                } else {
                    message.warning(response.data.message)
                }
            }
        )
    }


    deletebgimg =(e)=>{ //删除某个图片
        // console.log(`删除id为 ${e.uid}的图片`)  //这个uid我设置的图片的id,通过id去删除图片
        axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
            `name=${localStorage.getItem('login_user')}&action=deletebgimg&id=${e.uid}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    "Authorization": localStorage.getItem('jwt')
                }
            }

        ).then(
            response => {
                if (response.data.code === 1) {
                    message.success(response.data.message)
                } else {
                    message.warning(response.data.message)
                }
            },
            error =>{
                message.error("发生错误")
            }
        )
        // return false    //返回false才从界面删除 
    }

    //关闭预览图片弹窗
    handleCancel = () => this.setState({ previewVisible: false });

    //点击预览图标
    handlePreview = async file => {
        // console.log(file)
        //file :
        //name: "image.png"
        // status: "done"
        // uid: "-3"
        // url: "https://react-1305405728.cos.ap-nanjing.myqclou
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    //上传文件改变时
    handleChange = ({ fileList }) => this.setState({ fileList });


    //文件逻辑判断
    checkImage = (file) => {
        const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isIMAGE) {
            message.error('上传文件只能是图片格式!')
        }
        if (!isLt1M) {
            message.error('上传文件大小不能超过 1MB!')
        }
        return isIMAGE && isLt1M
    }

    //自定义文件上传
    handleFiles = (options) => {

        let file = options.file
        if (file) {

            if (this.checkImage(file)) {
                let fileObject = file
                let type = ".jpg"
                if (fileObject.type === "image/jpeg") {
                    type = ".jpeg"
                } else if (fileObject.type === "image/png") {
                    type = ".png"
                }
                cos.putObject({
                    Bucket: 'react-1305405728', /* 必须 */
                    Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
                    Key: 'clock-' + Math.random() + type,              /* 对象在存储桶的唯一标识，大概是名字吧 */
                    StorageClass: 'STANDARD',
                    Body: fileObject, // 上传文件对象
                    onProgress: function (progressData) {
                        //console.log(JSON.stringify(progressData));
                        //{"loaded":0,"total":552893,"speed":0,"percent":0}
                        //{"loaded":552893,"total":552893,"speed":297894.94,"percent":1}
                        let loaded = JSON.stringify(progressData).loaded
                        let total = JSON.stringify(progressData).total
                        //onProgress是上传进度相关的，onSuccess是上传成功监听事件
                        options.onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
                    }
                }, function (err, data) {
                    //console.log(err || data);
                    if (data) {
                        
                        //提交服务器
                        axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
                            `name=${localStorage.getItem('login_user')}&action=insertbgimg&imgname=${file.name}&imgurl=${'https://'+data.Location}`,
                            {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                                    "Authorization": localStorage.getItem('jwt')
                                }
                            }
                        ).then(
                            response => {
                                if (response.data.code === 1) {
                                    options.onSuccess(data, file);
                                    message.success(response.data.message)
                                } else {
                                    message.warning(response.data.message)
                                }
                            },
                            error => {
                                message.error("图片存储发生错误")
                                options.onSuccess(err, file);
                            }
                        )
                    }
                });
            }
        }
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        );
        return (
            <div>
                {/* 底盘 */}
                <Alert
                    message={`选择时钟底盘背景`}
                />
                <Upload
                    accept="image/gif, image/jpeg,image/jpg,image/png"  //  只能上传这4种样式
                    //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"   //上传地址
                    customRequest={this.handleFiles}	//通过覆盖默认的上传行为，可以自定义自己的上传实现
                    listType="picture-card" //照片墙样式  picture是竖着一列的样式
                    fileList={fileList}
                    onPreview={this.handlePreview}     //点击预览图标
                    onChange={this.handleChange}    //上传文件改变时
                    onRemove ={this.deletebgimg}    //删除图片
                >
                    {/* 列表内容超过1个不允许再添加，即不显示uploadButton */}
                    {fileList.length >=1 ? null : uploadButton}
                </Upload>
                {/* 查看图片大图的弹窗 */}
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                {/* 头像 */}
                {/* <Alert
                    message={`选择时钟边框背景`}
                />
                 <Upload
                    accept="image/gif, image/jpeg,image/jpg,image/png"  //  只能上传这4种样式
                    customRequest={this.txhandleFiles}	//通过覆盖默认的上传行为，可以自定义自己的上传实现
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
            </div>
        )
    }
}
