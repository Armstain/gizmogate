import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"


function App() {

  return (
    <>
     <Navbar></Navbar>
     <HomePage></HomePage>
     <Outlet></Outlet>
     
    </>
  )
}

export default App
