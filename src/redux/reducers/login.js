import {getCookie} from '../../utils/cookie'
import {LOGIN,QUIT} from '../constant'


const initState =  getCookie('expireIn') ? getCookie('expireIn') > new Date().getTime() ? true :false  : false      //初始化状态   
  

export default function countReducer(preState=initState,action){    //第一次才回用到initState 
    //从action对象中获取：type、data
    const {type} = action
    //根据type决定如何加工数据
    switch (type) {
        case LOGIN: //登录
            return preState = true
        case QUIT: //若果是开启
            return preState = false
        default:
            return preState 
    }
}