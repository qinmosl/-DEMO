/* 
    该文件专门为Count组件生成action对象
*/
import {CLOSE,OPEN} from '../constant'

export const openthewallpaper = () => ({type:OPEN})
export const closethewallpaper = () => ({type:CLOSE})