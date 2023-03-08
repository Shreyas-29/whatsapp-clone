import React from 'react';
import Head from 'next/head';
import { ProfileScreen, Sidebar } from '../components';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Profile({ chat, messages }: any) {

    const [user] = useAuthState(auth);

    const signOut = () => {
        auth
            .signOut()
            .catch((error) => {
                console.log("Error signing out:", error);
            });
    };

    return (
        <section className='flex items-stretch justify-center h-screen w-screen'>
            <Head>
                {/* @ts-ignore */}
                <title>WhatsApp - {user?.displayName?.charAt(0)?.toUpperCase() + user?.displayName?.slice(1)} Profile </title>
                <link rel="icon" href="/whatsapp.png" />
            </Head>
            <div className='hidden w-96 lg:inline h-screen bg-white'>
                <Sidebar />
            </div>
            <div className='w-full flex-1 h-screen'>
                <ProfileScreen user={user} signOut={signOut} />
            </div>
        </section>
    )
}

export default Profile
