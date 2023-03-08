import React from 'react';
import { BsMeta, BsWhatsapp } from 'react-icons/bs';

function Loading() {
    return (
        <div className='flex flex-col items-center justify-center h-screen space-x-2'>
            <BsWhatsapp className='w-20 h-20 object-cover text-green-500' />
            <div className='flex flex-col items-center fixed bottom-10'>
                <p className='text-slate-500 tracking-wider'>from</p>
                <div className='flex items-center space-x-2'>
                    {/* <Image src={'/meta.png'} alt='' width={500} height={500} className='w-6 h-6 text-primary' /> */}
                    <BsMeta className='w-6 h-6 object-cover text-primary' />
                    <p className='text-primary font-medium text-lg'>Meta</p>
                </div>
            </div>
        </div>
    )
}

export default Loading
