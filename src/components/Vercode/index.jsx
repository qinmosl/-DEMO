import React, { useEffect, useState, useCallback } from 'react'

export default function Vercode({ setcode }) { //验证码

    const [state, setstate] = useState(false)   //true false左右横条来刷新验证码

    const rn = useCallback(
        (min, max) => { //最大最小值范围中的随机值
            var diff = 0;
            var random = 0;
            var sum = min;
            if (min < max) {
                diff = max - min;
                random = diff * Math.random();
                sum = min + random;
            } else {
                diff = min - max;
                random = diff * Math.random();
                sum = max + random;
            }
            return sum;
        }, [])

    const rc = useCallback(
        (min, max) => { //rgb范围颜色值
            var r = rn(min, max);
            var g = rn(min, max);
            var b = rn(min, max);
            return `rgb(${r},${g},${b})`;
        }, [])

    const rstr = (context) => { //随机字符串
        var pool = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz';      //不要O和0体验感极差
        var compare = '';
        for (let i = 0; i < 4; i++) {
            //随机字
            var char = pool[parseInt(Math.random() * (10 + 26 * 2 - 3))];   //-3因为我把0Oo删掉了
            compare += char;
            //随机大小
            var size = rn(24, 30);
            //随机颜色
            //context.strokeStyle = rc(i * 28, i * 35); //这是绘制颜色
            context.fillStyle = rc(14, 98); //填充颜色
            //随机字体
            context.font = "bold " + size + "px Arial"
            //随机文字基线
            context.textAlign = "center" //文字宽度一半是x
            context.textBaseline = "top" //文字顶对到y
            context.shadowColor = "pink" //阴影颜色
            context.shadowOffsetX = 1
            context.shadowOffsetY = 1
            context.shadowBlur = 3 //模糊程度
            context.save(); //用图形变换中的 save() restore()而不影响下面的
            //随机旋转角度
            //context.translate(i*25+12+size/2,20+size/2) //如果是默认的话
            context.translate(i * 25 + 12 + size / 2, 20 + size)
            context.rotate(rn(-18, 18) * Math.PI / 180);  //canvas中的rotate方法是绕画布左上角（0,0）进行旋转的，而且会受到translate的影响
            //context.translate(-(i*25+12+size/2),-(20+size/2))
            context.translate(-(i * 25 + 12 + size / 2), -(20 + size))
            context.fillText(char, i * 25 + 12, 20)
            context.restore();
        }
        return compare;
    }

    const rline = (context) => { //随机干扰线
        for (let i = 0; i < 10; i++) {
            //状态设置
            context.beginPath()
            context.moveTo(rn(0, 120), rn(0, 50))
            context.lineTo(rn(40, 120), rn(20, 50))
            context.closePath()
            context.lineWidth = 1
            context.strokeStyle = rc(100, 255)
            //绘制
            context.stroke()
        }

    }

    const rimg = (context) => { //随机小图形干扰
        for (let i = 0; i < 20; i++) {
            context.fillStyle = rc(10, 233);
            context.beginPath();
            context.arc(rn(10, 100), rn(10, 50), 2, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }
    }



    useEffect(
        () => {
            let canvas = document.getElementById("canvas");
            canvas.width = 120;
            canvas.height = 50;
            let context = canvas.getContext("2d");

            canvas.style.backgroundColor = rc(166, 255);
            let str = rstr(context);    //先写字，不然盖不住
            rline(context);
            rimg(context);

            setcode(str);  //调用父组件的props，把值传过去，全换成小写比较
        }, [state])

    const changeCode = () => {
        setstate(!state)
    }

    return (
        <div>
            <canvas id="canvas" style={{ margin: "0px auto", display: "block", backgroundColor: "bisque" }} onClick={changeCode}>
                显示验证码失败
            </canvas>
            <span style={{ color: '#565858', fontSize: '12px' }}>点击图片可刷新验证码</span>
        </div>
    )
}
