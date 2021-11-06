import React, { Fragment } from 'react'

import { Upload, message, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import axios from 'axios'

import './index.scss'

const { Dragger } = Upload;

//文件逻辑判断
const checkImage = (file) => {
    const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isIMAGE) {
        alert('上传文件只能是图片格式!')
    }
    if (!isLt1M) {
        alert('上传文件大小不能超过 1MB!')
    }
    return isIMAGE && isLt1M
}

//自定义文件上传
const handleFiles = (options) => {
    let file = options.file
    console.log("是file", file)
    // if (file) {
    //     if (checkImage(file)) {
    //         let fileObject = file
    //         let type = ".jpg"
    //         if (fileObject.type === "image/jpeg") {
    //             type = ".jpeg"
    //         } else if (fileObject.type === "image/png") {
    //             type = ".png"
    //         }
    //         cos.putObject({
    //             Bucket: 'react-1305405728', /* 必须 */
    //             Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
    //             Key: 'clock-' + Math.random() + type,              /* 对象在存储桶的唯一标识，大概是名字吧 */
    //             StorageClass: 'STANDARD',
    //             Body: fileObject, // 上传文件对象
    //             onProgress: function (progressData) {
    //                 let loaded =  JSON.stringify(progressData).loaded
    //                 let total =  JSON.stringify(progressData).total
    //                 //onProgress是上传进度相关的，onSuccess是上传成功监听事件
    //                 options.onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);          
    //             }
    //         }, function (err, data) {
    //             if (data) {
    //                 //提交服务器
    //                 axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
    //                     `name=${localStorage.getItem('login_user')}&action=insertwallp&imgname=${file.name}&imgurl=${'https://'+data.Location}`,
    //                     {
    //                         headers: {
    //                             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    //                             "Authorization": localStorage.getItem('jwt')
    //                         }
    //                     }
    //                 ).then(
    //                     response => {
    //                         if (response.data.code === 1) {
    //                             options.onSuccess(data, file);
    //                             message.success(response.data.message)
    //                         } else {
    //                             message.warning(response.data.message)
    //                         }
    //                     },
    //                     error => {
    //                         message.error("图片存储发生错误")
    //                         options.onSuccess(err, file);
    //                     }
    //                 )
    //             }
    //         });
    //     }
    // }
}

//上传文件改变时
const handleChange = ({ fileList }) => this.setState({ fileList });

const deletebgimg = (e)=>{   //删除图片
    console.log(`删除id为 ${e.uid}的图片`)  //这个uid我设置的图片的id,通过id去删除图片
}

const fileList = [
    {
        name: "image.png",
        status: "done",
        uid: "-3",
        url: "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/baisi1.jpg"
    }
];

const props = {
    name: 'file',
    listType: "picture-card",
    //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"   //上传地址
    multiple: true, //多选文件
    accept: "image/gif, image/jpeg,image/jpg,image/png",  //  只能上传这4种样式
    defaultFileList: [...fileList],
    className: "upload-list-inline",

    customRequest:handleFiles,//通过覆盖默认的上传行为，可以自定义自己的上传实现
    // fileList={ fileList }
    onChange:handleChange  ,  //上传文件改变时
    onRemove:deletebgimg ,    //删除图片

    // onChange(info) {    //删除也是
    //     handleFiles(info)
    //     // const { status } = info.file;
    //     // if (status !== 'uploading') {
    //     //     console.log(info.file, info.fileList);
    //     // }
    //     // if (status === 'done') {
    //     //     message.success(`${info.file.name} 文件上传成功.`);
    //     // } else if (status === 'error') {
    //     //     message.error(`${info.file.name} 文件上传失败.`);
    //     // }
    // },
    // onDrop(e) { //当文件被拖入上传区域时执行的回调功能
    //     //alert('拖入文件', e.dataTransfer.files);
    // },
};


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




export default function Uploadbg() {
    return (
        <Fragment>
            <Alert message={`超过16张将暂时禁用`} />
            <Dragger {...props} >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或者将照片拖拽于此，实现背景图片上传</p>
                <p className="ant-upload-hint">支持一个或多个上传，不能上传非图片文件</p>

            </Dragger>

        </Fragment>
    )
}
