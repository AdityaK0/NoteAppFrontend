// import React from 'react'
// import { MdOutlinePushPin } from 'react-icons/md'
// import { MdCreate,MdDelete } from 'react-icons/md'
// import { timeFormatter } from '../../utils/timeFormat'

// function NoteCard({title,date,content,category,tags,isPinned,onEdit,onDelete,onPinNote}) {
    
//   return (
//     <div className='border  rounded p-4 bg-white  hover:shadow-xl transition-all ease-in-out '>

//         <div className='flex items-center justify-between'>
//             <div>
//                 <h6 className='text-sm font-medium '>{title}</h6>
//                 <span className='text-sx text-slate-500'>{timeFormatter(date)}</span>
//             </div>
//             < MdOutlinePushPin className={`icon-btn ${isPinned ? `text-blue-500`:`text-slate-300`}`} onClick={onPinNote} />

//         </div>

//         <p className='text-xs text-slate-600 mt-2' >{content?.slice(0,60)}</p>
//         <div className='flex items-center justify-between mt-2'>
//             <div className='text-xs text-slate-500 '>{tags.map((el)=>"#"+el)}</div>
//             <div className='flex items-center gap-2'>
//                 <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit}/>
//                 <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete}/>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default NoteCard

// import React from 'react'
// import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
// import { timeFormatter } from '../../utils/timeFormat'
import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
import { timeFormatter } from '../../utils/timeFormat'

function NoteCard({ title, date, content, tags, category, isPinned, onEdit, onDelete, onPinNote }) {
   return (
    <div className="relative border border-gray-300   rounded-xl p-5 m-1 bg-white transition-all ease-in-out duration-300 group 
    hover:shadow-2xl hover:-translate-y-2 hover:z-10 min-w-92 max-w-92">
       <div className="flex items-center justify-between mb-3">
         <div className="flex-grow">
           <h6 className="text-sm font-bold text-gray-800 truncate max-w-[80%]">{title}</h6>
           <span className="text-xs text-gray-500 block mt-1">{timeFormatter(date)}</span>
         </div>
         <MdOutlinePushPin
            className={`w-6 h-6 cursor-pointer transition-all duration-200 ${
              isPinned 
              ? "text-blue-500 opacity-100 scale-110" 
              : "text-gray-300 opacity-50 hover:text-gray-500 hover:opacity-80"
            }`}
            onClick={onPinNote}
         />
       </div>

       <p className="text-xs text-gray-600 mb-3 leading-relaxed min-h-[2rem]">
         {content?.slice(0, 100)}{content?.length > 100 ? "..." : ""}
       </p>

       {category && (
         <div className="mb-3">
           <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
             {category}
           </span>
         </div>
       )}

       <div className="flex items-center justify-between mt-3  pt-3 border-t border-gray-200">
         <div className="flex flex-wrap gap-1 max-w-[70%]">
           {tags?.map((el, index) => (
             <span 
               key={index} 
               className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
             >
               #{el}
             </span>
           ))}
         </div>

         <div className="flex items-center gap-3">
           <MdCreate
              className="w-5 h-5 cursor-pointer text-gray-400 hover:text-green-600 transition-all transform hover:scale-110"
              onClick={onEdit}
            />
           <MdDelete
              className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500 transition-all transform hover:scale-110"
              onClick={onDelete}
            />
         </div>
       </div>
     </div>
   )
}

export default NoteCard
