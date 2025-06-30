import React from 'react'
import { Avatar, AvatarImage } from '../../../../../../components/ui/avatar.jsx';
import { getColor } from '../../../../../../lib/utils.js';
import { HOST } from '../../../../../../utils/constants.js';
import { RiCloseFill } from 'react-icons/ri';
import {useAppStore} from '../../../../../../store/index.js';
const ChatHeader = () => {
  const {closeChat, selectedChatData, selectedChatType } = useAppStore();
  console.log(selectedChatType);
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 '>
      <div className='flex gap-5 items-center w-full justify-between'>
        <div className='flex gap-3 items-center justify-center'>
          <div className="w-12 h-12 relative ">
              {
                selectedChatType === "contact" ?<Avatar className="h-12 w-12  rounded-full overflow-hidden">
                  {    
                  selectedChatData.image ? <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="object-cover w-full h-full bg-black"/> : <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                  {
                                      selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()
                                  }
                              </div>}
                          </Avatar> 
                          :
                          <div className="bg-[#ffffff22] h-11 w-11 mt-1 flex items-center justify-center rounded-full">#</div>
                  }
                  
              
          </div>
          <div>
            {
              selectedChatType === "contact" && (selectedChatData.firstName === undefined ? "User" : `${selectedChatData.firstName} ${selectedChatData.lastName}`)
            }
            {
              selectedChatType === "channel" && selectedChatData.name
            }
          </div>
        </div>
        <div className='flex items-center gap-5 justify-center '>
            <button onClick={closeChat} className='border-1 rounded-2xl text-neutral-500 hover:border-none hover:outline-none hover:text-white transition-all duration-100 '>
                <RiCloseFill className='text-2xl '/>
            </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader;
