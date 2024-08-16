import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Registration from './pages/Registration'
import App from './App'
import AuthProvider from './provider/AuthProvider'
import HomePage from './pages/HomePage'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App></App>,
      children: [
        {
         index: true,
          element: <HomePage></HomePage>
          
        }
      ],
    },

    {
      path: '/login',
      element: <Login></Login>,
    },
    {
      path: '/registration',
      element: <Registration></Registration>,
    },
  ],
)

createRoot(document.getElementById('root')).render(
  
  <AuthProvider>
    <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>,
  </AuthProvider>
)
