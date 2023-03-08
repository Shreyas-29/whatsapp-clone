import React from 'react'
import { HiLockClosed } from 'react-icons/hi'

function Home() {
  return (
    <div className='flex-1 ml-72 flex-wrap lg:ml-96 hidden sm:flex flex-col relative items-center justify-center h-full'>
      <div className='flex flex-wrap flex-col items-center justify-center'>
        <img src="/chat.gif" alt="" className='w-60 h-60' />
        <h4 className='text-3xl font- mt-4 text-teal2'>
          Welcome to WhatsApp
        </h4>
        <p className='text-center text-teal2/60 max-w-md text-sm mt-4'>
          Stay connected with friends and family through seamless messaging with our WhatsApp website chatting app!
        </p>
      </div>
      <div className='absolute flex items-center space-x-2 bottom-10'>
        <HiLockClosed className='w-4 h-4 text-teal' />
        <p className='text-xs text-teal'>End-to-end encrypted</p>
      </div>
    </div>
  )
}

export default Home
