import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'

function App() {
  
  function Layout() {
    return(
      <>
        <Navbar/>
        <Outlet/>
        {/* <Footer/> */}
      </>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<p>Hello</p>}/>
      </Route>
    </Routes>
  )
}

export default App
