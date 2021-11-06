/* 
    该文件专门用于暴露一个store对象，整个应用只有一个store对象
*/

//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore,combineReducers} from 'redux'
//引入为Login组件服务的reducer
import loginReducer from './reducers/login'
//引入为壁纸组件服务的reducer
import wallpReducer from './reducers/wallp'
//谷歌插件 
import {composeWithDevTools} from 'redux-devtools-extension'

//汇总所有的reducer变为一个总的reducer
const allReducer = combineReducers({
	log_re:loginReducer,
	wall_re:wallpReducer
})

//暴露store
export default createStore(allReducer,composeWithDevTools())