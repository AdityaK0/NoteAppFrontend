import React, { useEffect,useContext } from 'react'
import Navbar  from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd, MdTry } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import Modal from 'react-modal'
import { data, Link , useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/Cards/EmptyCard'

import axios, { all } from 'axios'



function Home() {
  // const [userInfo,setUserInfo] = useState(null)
  const [loading,SetLoading] = useState(false)
  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown:false,
    type:"add",
    data:null,

  });

  const [showToastMsg,setShowToastMsg] = useState({
    isShown:false,
    message:"",
    type:"add"
  })


  const showToastMesage= (message,type)=>{
    setShowToastMsg({
      isShown:true,
      message:message,
      type:type
    })
  }

  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown:false,
      message:"",
      type:"add"
    })
  }

  
  const [allNotes, setAllNotes] = useState([])
  const navigate = useNavigate()

  const [isSearch,setIsSearch] = useState(false)

  const handleEditNote = (noteDetails)=>{
    return setOpenAddEditModal({
      isShown:true,
      data:noteDetails,
      type:"edit"
    });
  };


  const getAllNotes = async () =>{
     SetLoading(true)
      try {
            const response = await axiosInstance.get("api/v1/notes/")
      
            if(response.data && response.data.all_notes){
              console.log(response.data);
              setAllNotes(response.data.all_notes)

            }

      } catch (error) {
        if (error.response  && error.response.error) {
          console.log(error.response.error);
          
        } 
      }
      finally{
        SetLoading(false)
      }
  }

  // const getUserInfo = async ()=>{
  //   try {
  //     const response =  await axiosInstance.get("api/auth/get-user/") 
  //     if(response.data){
  //       console.log(response.data);
  //       setUserInfo(response.data)
  //       return
  //     }
  //   }
  //    catch (error) {
  //     if(error.response.status == 401){
  //       localStorage.clear()
  //       navigate("/login")
  //     }
  //     console.log(error);
      
  //   }
  // }

  const deleteNote = async (data)=>{
    const noteId = data.id
    try {
      const response = await axiosInstance.delete(`api/v1/notes/delete/${noteId}/`)
      if (response.data && response.data.message) {
       showToastMesage("Note Deleted Successfully",'delete')
       getAllNotes()

      }
    } catch (error) {
      if (error.response) {
        console.log(error,"An Unexpected Error Occured");
        
      }
    }
  }

  const pinNote = async (data) =>{
   const noteId = !data.ispinned
   console.log(noteId,data);
   
   try {
     const response = await axiosInstance.patch(`api/v1/notes/pin-note/${data.id}/`,{
      ispinned:noteId
     });

     if (response.data) {
      noteId?showToastMesage("Note Pinned !"):showToastMesage("Note Unpinned !");
      getAllNotes();
     }
   } catch (error) {
    console.log(error);
    
   }
  }


  const onSearchNote = async (query)=>{
    try {
      const response = await axiosInstance.get(`api/v1/notes/search-notes/`,{
        params:{query}
      })
      
      if (response.data && response.data.all_notes ) {
          setAllNotes(response.data.all_notes)
          setIsSearch(true)
      }

    } catch (error) {
     if (error.response && error.response.data) {
       console.log(error.response.data);
     }
      
    }
  }

  const onSearchClear =  async ()=>{
    getAllNotes();
    setIsSearch(false)
  }

  useEffect(()=>{
    // if (!userInfo) {
    //   getUserInfo();
    // }
    getAllNotes();
    return ()=>{}
  },[])

  return (
    <>
    <Navbar  onSearchNote={onSearchNote} onSearchClear={onSearchClear}  />

    <div className='container mx-auto'>
      {loading?
            <div className='flex h-screen justify-center items-center px-1'>
            <span className='text-gray-500 text-2xl'>Loading Notes ... </span>
          </div>
        : 
        <div>
        {allNotes && allNotes.length>0 ? 
              <div className='flex gap-2 flex-wrap justify-center py-3 '>
                {
                  allNotes.map((element)=>(
                      <NoteCard title={element.title}
                      date={element.created_at} 
                      content={element.description}
  
                      tags= {element.tags ? element.tags.split(",").map(tag => tag) : []} 
                      category = {element.category}
                      isPinned={element.ispinned}
                      onEdit={()=>{handleEditNote(element)}}
                      onDelete={()=>{deleteNote(element)}}
                      onPinNote={()=>{pinNote(element)}}
                      key={element.id}
                      />
                  ))
                }
                </div> 
              :<EmptyCard 
              imgSrc={isSearch?"/no-notes.svg":"/add-notes.svg"} 
              message={isSearch?`No Notes Found as per the given SEARCH query`:`Start Creating your first note click the right bottom  'Add' button to join thoughts , ideas and reminders . Let's Get started !` }
              extramessage = {"."}
            />}
  
        </div> }




      
     <button className='w-16 h-16 flex items-center  justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10 ' 
      onClick={()=>{
        setOpenAddEditModal({isShown:true,type:"add",data:null}); 
      }}>
        <MdAdd className='text-[32px] text-white'/>
      </button>

      <Modal
               isOpen = {openAddEditModal.isShown}
               onRequestClose = {()=>{}}
               style={{
                overlay:{
                backgroundColor:"rgba(0,0,0,0.2)"
                },
      
              }}
      
              contentLabel=""
              className="w-[35%] min-w-[350px] min-h-80vh overflow-y-auto max-h-[80vh] bg-white rounded-lg shadow-lg mx-auto mt-16 p-4 outline-none"
      >

         
           <AddEditNotes 
           type = {openAddEditModal.type}
           data = {openAddEditModal.data}

           onClose={()=>{
            setOpenAddEditModal(({
              isShown:false,
              type:"add",
              data:null
            }))
           }}
           getAllNotes = {getAllNotes}
           showToastMesage = {showToastMesage}
           />
      </Modal>

      <Toast 
        isShown = {showToastMsg.isShown}
        message = {showToastMsg.message}
        type    = {showToastMsg.type}
        onClose = {handleCloseToast}
      />
    </div>
    </>
  )
}

export default Home