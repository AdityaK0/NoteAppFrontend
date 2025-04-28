import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

function AddEditNotes({getAllNotes,data,type,onClose,showToastMesage}) {

  const [title,setTitle] = useState(data?.title || "")
  const [description,setdescription] = useState(data?.description || "")
  const [tags,setTags] = useState(data?.tags ? data.tags.split(",").map(tag => tag.trim()) : [])
  const [category,SetCategory] = useState(data?.category || "Work")

  const [error,SetError] = useState("")
  
  const addNewNote = async () =>{
    try {
      const response = await axiosInstance.post("/api/v1/notes/add-note/",{
          title:title,
          category:category,
          description:description,
          tags:  tags.join(",")
      });
       
      if (response.data) {
        showToastMesage("Note Added Successfully ")
        getAllNotes()
        onClose()
        
      }
        
    }catch (error) {
      if (error.response && error.response.data) {
              if(error.response.data["title"]) { return SetError(`${String(Object.keys(error.response.data))} :=> ${error.response.data["title"]}`) }
              if(error.response.data["description"]) { return SetError(`${String(Object.keys(error.response.data))} :=>  ${error.response.data["description"]}`)}
              if(error.response.data){return SetError("Please login  :=: "+ String(error.response.data.detail)) } 
              console.log(error);
              

            
      }
    }
    
  }
  const editNote = async () =>{
    try {
      const response = await axiosInstance.put(`api/v1/notes/update/${data.id}/`,{
          title:title,
          category:category,
          description:description,
          tags:  tags.join(",")
      });

      if (response.data) {
        showToastMesage("Note Updated Successfully ")
        getAllNotes()
        onClose()
        
      }
        
    }catch (error) {
      if (error.response && error.response.data) {
              if(error.response.data["title"]) { return SetError(`${String(Object.keys(error.response.data))} :=> ${error.response.data["title"]}`) }
              if(error.response.data["description"]) { return SetError(`${String(Object.keys(error.response.data))} :=>  ${error.response.data["description"]}`)}
              if(error.response.data){return SetError(String(error.response.data.detail)) } 

            
      }
    }
  }



  const handleAddNote = () =>{
      if(!title){
        SetError("Please enter the title");
        return
      }
      if(!description){
        SetError("Please enter the description");
        return
      }

      SetError("")

      if(type == "edit"){
        editNote()
      }
      else{
        addNewNote()
      }
  }

  return (
    <div className='relative p-2 outline-none'>
         <button
         className='w-8 h-8  cursor-pointer text-black  rounded-full flex items-center justify-center   text-sm  absolute -top-3 -right-3 hover:bg-gray-500 '
         onClick={onClose}
         >
          <MdClose className='text-xl text-slate-400'/>
         </button>
        <div  className='flex flex-col gap-2'>
          <label htmlFor="" className='input-label'>TITLE</label>
          <input type="text"
           className='text-[14px] shadow-xs shadow-black text-slate-950 outline-none  rounded px-2 py-2'
           placeholder='Go To Gym At 5'
           value={title}
           onChange={({target})=>setTitle(target.value)}
           />
        </div>


        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="category" className="input-label">CATEGORY</label>
          <select
            id="category"
            className="text-[14px] shadow-xs shadow-black text-slate-950 outline-none  rounded px-2 py-2"
            value={category}
            onChange={({ target }) => SetCategory(target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
            <option value="Daily Work">Daily Work</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className='flex flex-col gap-2 mt-4'>
          <label htmlFor="" className='input-label'>description</label>
          <textarea 
             type="text"
             className='text-sm text-slate-950 outline-none bg-slate-50 p-2  shadow-xs shadow-black rounded px-2 py-2'
             placeholder='description'
             rows={4}
             value={description}
             onChange={({target})=>setdescription(target.value)}

          />
        </div>

        <div className='mt-3'>
           <label htmlFor="" className='input-label'>TAGS</label>
           <TagInput tags={tags} setTags={setTags} />
        </div>
          <div className='h-3 p-2 text-center'>
               {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
          </div>
         <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
            {type === "edit"?"UPDATE":"ADD"}
         </button>
    </div>
  )
}

export default AddEditNotes