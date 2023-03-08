import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HiLockClosed } from 'react-icons/hi';

function HomePage() {
    return (
        <div className='flex flex-col relative items-center justify-center h-screen'>
            <Head>
                <title>WhatsApp - Welcome</title>
                <link rel="icon" href="/whatsapp.png" />
            </Head>
            <div className='flex flex-col items-center justify-center'>
                <img src="/chat.gif" alt="" className='w-60 h-60' />
                <h4 className='text-3xl font- mt-4 text-teal2'>
                    Welcome to WhatsApp
                </h4>
                <p className='text-center text-teal2/60 max-w-md text-sm mt-4'>
                    Stay connected with friends and family through seamless messaging with our WhatsApp website chatting app!
                </p>
                <Link href={'/login'}>
                    <button className='mt-8 w-60 bg-primary hover:bg-green-500 hover:shadow-lg active:scale-90 hover:shadow-primary/40 transition-all py-2 rounded-md text-white font-medium'>
                        Get started
                    </button>
                </Link>
            </div>
            <div className='absolute flex items-center space-x-2 bottom-10'>
                <HiLockClosed className='w-4 h-4 text-teal' />
                <p className='text-xs text-teal'>End-to-end encrypted</p>
            </div>
        </div>
    )
}

export default HomePage
