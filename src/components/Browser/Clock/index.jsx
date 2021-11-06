import React, { useEffect } from 'react'

import axios from 'axios'
import Pointer from './Pointer'
import './index.scss'
export default function Clock() {


    const [bgimg, setBgimg] = React.useState('https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-9.jpg');

    useEffect(() => {
        if (localStorage.getItem('login_user')) {
            axios.post('/api/brserver/selectdb.php',
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
                        setBgimg(response.data.data.data[0].imgurl)
                    }
                }
            )
        }
    }, [])

    useEffect(() => {
        let canvas = document.getElementById('canvas');
        canvas.width = 220;
        canvas.height = 220;
        let ctx = canvas.getContext('2d');
        let x = canvas.width / 2,       //要取就不能在scss里面设置 得在style里面设置
            y = canvas.height / 2;
        ctx.translate(x, y); //将画布原点移到中心  默认画布原点在左上角
        //画大圆盘边框
        let backgroundimg = new Image()
        backgroundimg.src = "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/baisi6.jpg"
        backgroundimg.onload = function () { //等图片加载到再执行
            ctx.save();
            let pattern = ctx.createPattern(backgroundimg, "repeat") //可以用img,也可以用canvas
            ctx.beginPath();
            ctx.arc(0, 0, 105, 0, Math.PI * 2); //画圆
            ctx.strokeStyle = pattern;  //画线样式
            ctx.lineWidth = '10';
            ctx.closePath();
            ctx.stroke();   //绘制     
        }
        ctx.restore();

        //画背景
        let img = new Image()
        img.src = bgimg
        img.onload = function () { //等图片加载到再执行
            ctx.save(); //save()方法被调用后，当前的状态就被推送到栈中保存 所以只保存了 画布原点
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2); //画圆
            ctx.closePath();
            ctx.clip();         //把旁边的图切割了
            ctx.translate(-x, -y);
            ctx.drawImage(img, 0, 0, 220, 220);
            ctx.restore();//每一次调用restore方法，上一次保存的状态就从栈中弹出，所有设定都恢复

            //画小时数          保证背景先绘制，不然会被图片遮住
            ctx.save();
            let hourNum = ["Ⅲ ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ ", "Ⅷ ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ", 'Ⅰ', "Ⅱ"];
            ctx.font = '18px Arial';
            ctx.strokeStyle = '#333';
            ctx.textAlign = 'center';//水平对齐方式
            ctx.textBaseline = 'middle';//垂直方向上水平居中
            hourNum.forEach((item, index) => {
                let rad = Math.PI * 2 / 12 * index;
                let x = Math.cos(rad) * 80;
                let y = Math.sin(rad) * 80;
                ctx.fillText(item, x, y);
            })

            //画小数点
            for (let i = 0; i < 60; i++) {
                let rad = Math.PI * 2 / 60 * i;
                let x = Math.cos(rad) * 95,
                    y = Math.sin(rad) * 95;
                if (i % 5 === 0) {
                    //小时对应的点
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#58FA58'
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#FE9A2E';
                    ctx.fill();
                }
            }
            ctx.restore();
        }
    }, [bgimg])

    return (
        <div className="clockmodule">
            <div className="canvasclock">
                <canvas id="canvas" > </canvas>
            </div>
            <Pointer />
        </div>
    )
}
