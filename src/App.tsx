import './App.css'
import { Outlet, Route, Routes } from 'react-router'

function App() {
  
  function Layout() {
    return(
      <>
        {/* <Navbar/> */}
        <Outlet/>
        {/* <Footer/> */}
      </>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        
      </Route>
    </Routes>
  )
}

export default App
