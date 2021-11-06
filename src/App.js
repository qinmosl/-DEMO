import React, { useEffect,lazy ,Suspense} from 'react'
import { Route,  } from 'react-router-dom'

import Loding from './components/Loding'
import Browser from './components/Browser'
const Admin = lazy(() => import("./components/Admin"))

export default function App() {
  useEffect(() => {
    document.onselectstart = () => false   //禁止选择网页中的文字
  }, [])

  return (
    <Suspense fallback={<Loding />}>
      {/* 注册路由 */}
     
      <Route path="/br" component={Browser} />
      <Route path="/login" component={Admin} />
      <Route path="/home" component={Admin} />
      <Route exact path="/" component={Browser} />
     
    </Suspense>
  )
}
