import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { toast } from "sonner";
import { useEffect } from "react";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";



const Chat = () => {
    const {isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress} = useAppStore();
    const {userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();


    useEffect(()=>{
        if(!userInfo.profileSetup){
            toast.error("Please setup profile to continue");
            navigate("/profile");
        }
    },[userInfo, navigate]);
    
    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            {
                isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg" >
                    <h5 className="animatae-pulse text-5xl ">Uploading file</h5>
                    {fileUploadProgress}
                </div>
            }
            {
                isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg" >
                    <h5 className="animatae-pulse text-5xl ">Downloading file</h5>
                    {fileDownloadProgress}
                </div>
            }
            <ContactsContainer/>
            {
                selectedChatType === undefined ? <EmptyChatContainer/> : < ChatContainer/>
            }
        </div>
    )
}
export default Chat;