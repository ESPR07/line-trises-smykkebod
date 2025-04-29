import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

function App() {
  
  function Layout() {
    return(
      <>
        <Navbar/>
        <Outlet/>
        <Footer/>
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
