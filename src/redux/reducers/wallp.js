/* 
    1.该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
    2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import {CLOSE,OPEN} from '../constant'

const initState = false //初始化状态
export default function countReducer(preState=initState,action){    //第一次才回用到initState 

    const {type} = action
    //根据type决定如何加工数据
    switch (type) {
        case CLOSE: //如果是关闭
            return preState = false
        case OPEN: //若果是开启
            return preState =true
        default:
            return preState 
    }
}