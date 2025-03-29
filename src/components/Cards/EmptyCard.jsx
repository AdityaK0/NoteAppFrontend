import React from 'react'

function EmptyCard({imgSrc,message,extramessage}) {
  return (
    <div className='flex flex-col items-center mt-20'>
        <img src={imgSrc} alt="No notes" className='w-60' />
        <p className='w-1/2 text-xl font-medium text-slate-700 text-center leading-7 mt-5'>
        {message} 
        </p>
        <h2 className='text-orange-500 text-2xl mt-3 font-semibold'>
        {
          extramessage.length>0?extramessage:""
        }
        </h2>

        
    </div>
  )
}

export default EmptyCard