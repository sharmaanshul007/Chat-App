import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button.jsx'
import { toast  } from 'sonner'
import {apiClient} from'@/lib/api-client'
import { SIGNUP_ROUTE } from '@/utils/constants'
import { LOGIN_ROUTE } from '../../utils/constants'
import { useAppStore } from '@/store/index.js'
const Auth = () => {

    const {setUserInfo} = useAppStore();

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if(!email.length){
            toast("Email is required");
            return false;
        }
        if(!password.length){
            toast("Password is required");
            return false;
        }
        return true;
    }

    const validateSignup = () => {
        if(!email.length){
            toast("Email is required");
            return false;
        }
        if(!password.length){
            toast("Password is required");
            return false;
        }
        if(password !== confirmPassword){
            toast("Passwords do not match");
            return false;
        }
        return true;
    }

    const handleLogin = async() => {
        try{
            if(validateLogin()){  
           const response = await apiClient.post(LOGIN_ROUTE, {email,password}, {withCredentials:true});
           if(response.data.user.id){
                setUserInfo(response.data.user);
                if( response.data.user.profileSetup ){
                    navigate("/chat");
                }
                else{
                    navigate("/profile");
                }
           }
        }
        }catch(error){
            console.error("Error in handleLogin", error);
        }
    }
    const handleSignUp = async() => {
        if(validateSignup()){  
           const response = await apiClient.post(SIGNUP_ROUTE, {email,password}, {withCredentials:true});
           if(response.status === 201){
                toast("Signup Successful");
                setUserInfo(response.data.user);
                navigate("/profile");
           }
        }

    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center" >
            <div className="h-[88vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl ">
                                Welcome
                            </h1>
                            <img src={Victory} alt="victory" className="h-[100px]" />
                        </div>
                        <p className='font-medium text-center'>Fill in the Details to get started with the best Chat app!!</p>
                    </div>
                    <div className='flex items-center justify-center w-full'><Tabs>
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 roudned-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all ">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 roudned-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all ">SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 " value="login">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                <Input placeholder="Paassword" type="password" className="rounded-full p-6" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                <Button className="rounded-full p-6 " onClick={handleLogin}>
                                    Login
                                </Button>
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-3 " >
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                <Input placeholder="Paassword" type="password" className="rounded-full p-6" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                <Input placeholder="Confirm Paassword" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                                <Button className="rounded-full p-6 " onClick={handleSignUp}>
                                    Signup
                                </Button>
                            </TabsContent>
                        </Tabs></div>
                </div>
                <div className='hidden xl:flex justify-center items-center'>
                    <img src={Background} alt="background" className='h-[350px] w-[100%] ' />
                </div>
            </div>
        </div>
    )
}

export default Auth ;