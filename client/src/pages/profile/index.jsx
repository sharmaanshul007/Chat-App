import { useAppStore } from "../../store";
import {apiClient} from "../../lib/api-client.js";
import {useNavigate} from "react-router-dom";
import {getColor, colors} from "../../lib/utils.js"
import { useEffect, useRef, useState } from "react";
import {toast} from 'sonner';
import {Button} from "../../components/ui/button.jsx";
import {Input} from "../../components/ui/input.jsx";
import { FaPlus, FaTrash } from "react-icons/fa";
import {Avatar, AvatarImage} from "../../components/ui/avatar.jsx";
import {IoArrowBack} from "react-icons/io5";
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE, HOST } from "../../utils/constants.js";
const Profile = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const {userInfo,setUserInfo} = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");   
    const [image,setImage] = useState("");
    const [hovered,setHovered] = useState(false);   
    const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);

    useEffect(() => { 
        if(userInfo.profileSetup){
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color || 0);
        }
        if(userInfo.image){
            setImage(`${HOST}/${userInfo.image}`);
        }
    }, [userInfo]);
    const validateProfile = () => {
        if(!firstName){
            console.log(userInfo.firstName);
            console.log(firstName);
            toast("First name is required"); 
            return false;
        }
        if(!lastName){
            toast("Last name is required", ); 
            return false;
        }
        return true;
    }
    const saveChanges = async() => {
        if(validateProfile()){
            try{
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName,lastName,color:selectedColor}, {withCredentials:true});
                if(response.status === 200 && response.data){
                    setUserInfo({...response.data});
                    toast("Profile updated successfully", {duration: 3000});
                    navigate("/chat");
                }
            }
            catch(error){
                console.log(error);
            }
        }
    }

    const navigateChat = () => {
        navigate("/chat");     
    }

    const handleFileInputClick = () => {
        alert('open');
        fileInputRef.current.click();
    };

    const handleImageChange = async(event) => {
        const file = event.target.files[0];
        console.log(event.target.files);
        if(file){
            const formData = new FormData();
            formData.append("profile-image", file);
            const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});

            if(response.status === 200 && response.data.image){
                setImage(response.data.image);
                console.log(response.data.image);   
                setUserInfo(prev => ({...prev, image: response.data.image}));
                toast("Profile image updated successfully", {duration: 3000});
            }
            else{
                toast("Failed to update profile image", {duration: 3000});
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);

            }
            reader.readAsDataURL(file);
        }
    }

    const handleDeleteImage = async() => {
        try{
            const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials:true});
            if(response.status === 200){
                setImage(null);
                setUserInfo(prev => ({...prev, image: ""}));
                toast("Profile image removed successfully", {duration: 3000});
            }
            else{
                toast("Failed to remove profile image", {duration: 3000});
            }
        }catch(error){
            console.log("Hello");
            console.log(error);
            toast("Failed to remove profile image", {duration: 3000});
        }
    }
    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-10 " >
            <div className="flex flex-col  gap-10 w-[80vw] md:w-max">
                <div>
                    <IoArrowBack className="text-2xl lg:text-3xl text-white/90 cursor-pointer" onClick={navigateChat}/>
                </div>
                <div className="grid grid-cols-2">
                    <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center" onMouseEnter={()=> setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {image ? <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black"/> : <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                {
                                    firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                                }
                            </div>}
                        </Avatar>
                        {
                            hovered && 
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia rounded-full" onClick={image ? handleDeleteImage : handleFileInputClick}>
                                {
                                    image ? (<FaTrash className="text-white text-3xl cursor-pointer"/>) : (<FaPlus className="text-white text-3xl cursor-pointer"/>)
                                }
                            </div>
                        }
                        <input className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" type="file" ref={fileInputRef}></input>
                    </div>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                        <div className="w-full">
                            <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className="w-full">
                            <Input placeholder="First Name" type="text"  value={firstName} onChange={e=>setFirstName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className="w-full">
                            <Input placeholder="Second Name" type="text"  value={lastName} onChange={e=>setLastName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className="w-full flex gap-5">

                            {
                                colors.map((color,index)=><div key={index} onClick={()=>setSelectedColor(index)} className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor===index ? " outline-white/50 outline-1" : ""}`}></div>)
                            }

                        </div>
                    </div>
                </div>
                <div className="w-full">
                            <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-200" onClick={saveChanges}> Save Changes</Button>
                </div>
            </div>
        </div>)
}
export default Profile;