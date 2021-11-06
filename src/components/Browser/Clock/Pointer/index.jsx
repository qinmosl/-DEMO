import React, { useEffect }  from 'react'

export default function Pointer() {

    useEffect(()=>{
        let canvastime = document.getElementById('canvas-time');
        canvastime.width = 220;
        canvastime.height = 220;
        let timectx = canvastime.getContext('2d');
        let x = canvastime.width / 2,       //要取就不能在scss里面设置 得在style里面设置
            y = canvastime.height / 2;
        timectx.translate(x, y); //将画布原点移到中心  默认画布原点在左上角

        function drawinover(h, m, s) {  //画时钟中的全部
            timectx.save();
            timectx.translate(-x, -y);
            timectx.clearRect(0, 0, canvastime.width, canvastime.height);
            timectx.restore();
            drawDot();
            drawHour(h, m);
            drawMinute(m);
            drawSecond(s);
        }
    
    
        function drawDot() {            //画中心得那个点
            timectx.save();
            timectx.beginPath(0, 0);
            timectx.arc(0, 0, 4, 0, Math.PI * 2);
            // timectx.fillStyle = 'red';
            timectx.fill();
            timectx.restore();
        }
    
        function drawHour(h, m) {       //小时
            timectx.save();
            timectx.beginPath(0, 0);
            let rad = Math.PI * 2 / 12 * (h + m / 60);
            timectx.rotate(rad);//旋转的角度必须写在画线之前
            timectx.moveTo(0, 10);
            timectx.lineTo(0, -50);
            timectx.strokeStyle = 'green';
            timectx.lineWidth = '3'
            timectx.stroke();
            timectx.restore();
        }
        function drawMinute(m) {        //分钟
            timectx.save();
            timectx.beginPath(0, 0);
            let rad = Math.PI * 2 / 60 * m;
            timectx.rotate(rad);
            timectx.moveTo(0, 10);
            timectx.lineTo(0, -60);
            timectx.strokeStyle = 'blue';
            timectx.lineWidth = '2'
            timectx.stroke();
            timectx.restore();
        }
        function drawSecond(s) {        //秒
            timectx.save();
            timectx.beginPath();
            let rad = Math.PI * 2 / 60 * s;
            timectx.rotate(rad);
            timectx.moveTo(0, 10);
            timectx.lineTo(0, -70);
            timectx.strokeStyle = 'red';
            timectx.lineWidth = '1'
            timectx.stroke();
            timectx.restore();
        }


        let timer = setInterval(()=>{
            let date = new Date();
            let h = date.getHours(),
                m = date.getMinutes(),
                s = date.getSeconds();
            drawinover(h, m, s);
        },1000)
        return ()=>{
            clearInterval(timer)
        }
    },[]) 


    return (
        <div className="canvaspointer">
            <canvas id="canvas-time" > </canvas>
        </div>
    )
}
