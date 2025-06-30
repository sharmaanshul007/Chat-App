import {apiClient} from "../../../../../../lib/api-client.js"
import { useRef, useEffect } from 'react';
import {GrAttachment} from 'react-icons/gr';
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '../../../../../../store';
import { useSocket } from '../../../../../../context/SocketContext';
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
const MessageBar = () => {
  const fileInputRef = useRef();
  const emojiRef = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const {selectedChatType, selectedChatData, userInfo,setIsUploading,setFileUploadProgress} = useAppStore();
  const handleAddEmoji = (emoji) => {
    setMessage((msg)=> msg + emoji.emoji);
  }
  const socket = useSocket();
  const handleSendMessage = async() => {
    if(selectedChatType === "contact"){
      socket.emit("sendMessage",{
        sender:userInfo.id,
        content:message,
        recipient:selectedChatData._id,
        messageType:"text",
        fileUrl:undefined
      });
    }else if(selectedChatType === "channel"){
      console.log(message);
      console.log(userInfo.id);
      console.log(selectedChatData);
        socket.emit("send-channel-message",{
          sender:userInfo.id,
          content:message,
          messageType:"text",
          fileUrl:undefined,
          channelId:selectedChatData._id
        });
    }
    setMessage("");
  }

  const handleAttachmentClick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async(event) =>{
    try{
      const file = event.target.files[0];
      if(file){
        const formData = new FormData();
        formData.append("file",file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{
          withCredentials:true,
          onUploadProgress:data=>{setFileUploadProgress(Math.round((100*data.loaded)/data.total))}
        });

        if(response.status === 200 && response.data){
          setIsUploading(false);
          if(selectedChatType === "contact"){
              socket.emit("sendMessage",{
                sender:userInfo.id,
                content:undefined,
                recipient:selectedChatData._id,
                messageType:"file",
                fileUrl:response.data.filePath
              });
          }
          else if(selectedChatType === "channel"){
              socket.emit("send-channel-message",{
                sender:userInfo.id,
                content:undefined,
                messageType:"file",
                fileUrl:response.data.filePath,
                channelId:selectedChatData._id
              });
          }
        }

      }
    }catch(error){
      setIsUploading(false);
      console.log(error);
    }
  }

  useEffect(()=>{
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  },[])

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input type="text" onChange={(e)=>setMessage(e.target.value)} placeholder='Enter Your Message' className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' value={message}></input>
        <button onClick={handleAttachmentClick} className=' rounded-2xl text-neutral-500 hover:border-none hover:outline-none hover:text-white transition-all duration-100 '>
          <GrAttachment className='text-2xl '/>
        </button>
        <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange}/>
        <div className='relative'>
          <button className='rounded-2xl text-neutral-500 hover:border-none hover:outline-none hover:text-white transition-all duration-100' onClick={()=>setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className='text-2xl'/>          
          </button>
          <div className='absolute bottom-16 right-0' ref={emojiRef}>
            <EmojiPicker theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false}/>
          </div> 
        </div>
        <button onClick={handleSendMessage} className='rounded-medium flex items-center bg-[#8417ff]  hover:border-none hover:outline-none hover:text-white hover:bg-[#741bda]  transition-all duration-100'>
            <IoSend className='text-2xl '/>       
          </button>
      </div>
    </div>
  )
}

export default MessageBar;
