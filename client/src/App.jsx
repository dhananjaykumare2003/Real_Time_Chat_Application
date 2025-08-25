import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast';
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

const App = () => {

  const {authUser} = useContext(AuthContext);
  
  const appRouter = createBrowserRouter([
    {
      path: "/", 
      element: authUser ? <HomePage></HomePage> : <Navigate to="/login"/>
    },
    {
      path: "/login",
      element: !authUser ? <LoginPage></LoginPage> : <Navigate to="/"/>
    },
    {
      path: "/profile",
      element: authUser ? <ProfilePage></ProfilePage> : <Navigate to="/login"/>
    }
  ]);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster></Toaster>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default App