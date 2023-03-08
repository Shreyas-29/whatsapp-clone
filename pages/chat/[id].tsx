import Head from 'next/head'
import React from 'react'
import { Sidebar } from '../../components'
import ChatsScreen from '../../components/ChatsScreen'
import { GetServerSidePropsContext } from 'next'
import { auth, db } from '../../firebase'
import { doc, collection, orderBy, getDocs, query, getDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth'

function Chat({ messages, chat }: any) {

    const [user] = useAuthState(auth);
    

    return (
        <section className='flex items-stretch justify-center h-screen w-screen'>
            <Head>
                <title>WhatsApp - Chat with {user?.displayName!} </title>
                <link rel="icon" href="/whatsapp.png" />
            </Head>
            <div className='hidden w-96 lg:inline h-screen bg-white'>
                <Sidebar />
            </div>
            <div className='w-full flex-1 h-screen'>
                <ChatsScreen chat={chat} messages={messages} />
            </div>
        </section>
    )
}

export default Chat;

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const chatRef = doc(db, "chats", context?.query?.id!.toString());
    const messageQuery = query(collection(chatRef, "messages"), orderBy("timestamp", "asc"));
    const messageSnapshot = await getDocs(messageQuery);

    const messages = messageSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().getTime(),
    }));

    const chatSnapshot = await getDoc(chatRef);
    // const chatRes = await chatRef.get();
    const chat = {
        id: chatSnapshot.id,
        ...chatSnapshot.data()
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat,
        },
    };
}