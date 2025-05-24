import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Homepage from './pages/Homepage'
import BrowsePage from './pages/BrowsePage'

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
        <Route index element={<Homepage/>}/>
        <Route path="browse" element={<BrowsePage/>}/>
      </Route>
    </Routes>
  )
}

export default App
