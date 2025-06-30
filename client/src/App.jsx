import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import Auth from './pages/auth/index.jsx'
import Chat from './pages/chat/index.jsx'
import Profile from './pages/profile/index.jsx'
import { useAppStore } from './store/index.js'
import { GET_USER_INFO } from './utils/constants.js'
import {apiClient} from './lib/api-client.js'
const PrivateRoute = ({children})=> {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({children})=> {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ?  <Navigate to="/chat"/> : children ;
}

const App = () => {
  const {userInfo,setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(()=> {
    const getUserData = async() =>{
      setLoading(true);
      try{
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials: true
        })
        if(response.status === 200){
          setUserInfo(response.data);
        }
        else{
          setUserInfo(undefined);
        }
      }catch(err){
        setUserInfo(undefined);
        console.error("Error fetching user data in app.jsx", err);
      }
      finally{
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    }
    else{
      setLoading(false);
    }
  },[userInfo, setUserInfo]);
  if(loading){
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  } 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>}/>
        <Route path="/chat" element={<PrivateRoute><Chat/></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path="*" element={<Navigate to={"/auth"}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
