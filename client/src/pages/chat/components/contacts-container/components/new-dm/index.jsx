import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../../../components/ui/tooltip.jsx";
import {apiClient} from "../../../../../../lib/api-client.js"
import {ScrollArea} from "../../../../../../components/ui/scroll-area.jsx"
import { FaPlus } from "react-icons/fa";
import { HOST } from "../../../../../../utils/constants.js";
import { Avatar, AvatarImage } from "../../../../../../components/ui/avatar.jsx";
import { useState } from "react";
import { getColor } from "../../../../../../lib/utils.js";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "../../../../../../lib/utils.js";
import {Input} from "../../../../../../components/ui/input.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog.jsx";
import { SEARCH_CONTACTS_ROUTE } from "../../../../../../utils/constants.js";
import { useAppStore } from "../../../../../../store/index.js";
const NewDM = () => {
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [openNewContactModal, setOpenNewContactModal] = useState(false);

    const {setSelectedChatType, setSelectedChatData} = useAppStore();


    const searchContacts = async(searchTerm) =>{
        try{
            if(searchTerm.length > 0){
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE,{searchTerm},{withCredentials:true});
                if(response.status === 200 && response.data.contacts){
                    setSearchedContacts(response.data.contacts);    
                }
                
            }
            else{
                setSearchedContacts([]);
            }
            

        }catch(error){
            console.log(error);
        }
    }

    const selectNewContact = (contact) =>{
        setOpenNewContactModal(false);
        setSearchedContacts([]);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
    };


    return (<>
        <Tooltip>
        <TooltipTrigger><FaPlus onClick={()=>setOpenNewContactModal(true)} className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all"/></TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
        </TooltipContent>
        </Tooltip>
        <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] gap-10 h-[400px] flex flex-col ">
            <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
                <Input placeholder="Search Contacts" onChange={e => searchContacts(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
            </div>
            
            {
                searchedContacts.length > 0 && <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5 ">
                    {
                        searchedContacts.map((contact) => (<div onClick={() => selectNewContact(contact)} key={contact._id} className="flex gap-3 items-center cursor-pointer">

                            <div className="w-12 h-12 relative ">
                                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                    {    
                                    contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black rounded-full"/> : <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                    {
                                            contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                        }
                                    </div>}
                                </Avatar>
                            </div>
                            <div className="flex flex-col">
                                <span>
                                {
                                    contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : " "
                                }</span>
                                <span className="text-neutral-400 text-sm">{contact.email}</span>
                            </div>

                        </div>))
                    }
                </div>
            </ScrollArea>
            }
            {
                searchedContacts.length <= 0 && <div className='flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all mt-5 md:mt-2'>
                <Lottie
                    isClickToPauseDisabled={true}
                    height={100}
                    width={100}
                    options={
                        animationDefaultOptions
                    }
                />
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                    <h3 className='poppins-medium'>
                        Hi <span className='text-purple-500'>!</span> Search new
                        <span className='text-purple-500'> Contacts </span>
                    </h3>
                </div>
    </div>
            }
            
        </DialogContent>
        </Dialog>
    </>)
}

export default NewDM;