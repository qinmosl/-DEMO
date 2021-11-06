/* 
    生成action对象
*/
import {LOGIN,QUIT} from '../constant'

export const adminlogin = () => ({type:LOGIN})
export const adminquit = () => ({type:QUIT})