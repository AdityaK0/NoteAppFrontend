import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

function TagInput({ tags = [], setTags }) {
  const [inputValue, setInputValue] = useState("");

  // Ensure `tags` is always an array
  if (!Array.isArray(tags)) {
    tags = typeof tags === "string" ? tags.split(",").map(tag => tag.trim()) : [];
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue(""); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addNewTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded max-w-[200px] truncate">
              #{tag}
              <button onClick={() => handleRemoveTag(index)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent shadow-xs shadow-black px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 hover:text-white"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
}

export default TagInput;

// import React from 'react'
// import { MdAdd,MdClose } from 'react-icons/md'
// import { useState } from 'react'

// function TagInput({tags=[],setTags}) {
//   const [inputValue,setInputValue] = useState("")
//   const handleInputChange = (e)=>{
//     setInputValue(e.target.value)
//   }
  
//   const addNewTag = () =>{
//     if(inputValue.trim() !== ""){
//       console.log(inputValue,"got");
      
//       setTags([...tags,inputValue.trim()])
//       console.log(tags);
      
//       setInputValue("")
//     }
//   }

//   const handleKeyDown = (e)=>{
//     if(e.key == "Enter"){
      
//       addNewTag();
//     }
//     if(e.key == "Backspace"){
      
//       setTags(tags.filter((_,index)=>index !== tags.length-1))
//     }
//   }

//   const handleRemoveTag = (tagToRemove)=>{
//     setTags(tags.filter((tag,index)=> index !== tagToRemove))
//   }


//   return (
//     <div>
//         {tags.length>0 ? <div className=' flex items-center gap-2 flex-wrap mt-2'>
//          {tags.map((tag,index)=>{
//              return (<span key={index} className='flex  items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded max-w-[200px] truncate overflow-x-auto'>
//               #{tag}
//               <button onClick={()=>{handleRemoveTag(index)}}>
//                 <MdClose/>
//               </button>
//            </span>)
//          })}
//        </div>:null}

//         <div className='flex items-center gap-4 mt-3'>
//             <input 
//               type="text" 
//               className='text-sm bg-transparent border px-3 py-2 rounded outline-none'
//               placeholder='Add tags'
//               value={inputValue}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               />

//              <button
//               className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 hover:text-white'
//               onClick={()=>addNewTag()}    
//               >
//                  <MdAdd className='text-2xl text-blue-700 hover:text-white'/>
//              </button>
//         </div>
//     </div>
//   )
// }

// export default TagInput