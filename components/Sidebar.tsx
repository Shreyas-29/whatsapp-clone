import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { BsPeopleFill, BsThreeDotsVertical } from 'react-icons/bs';
import { BiSearchAlt2 } from 'react-icons/bi';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, addDoc } from "firebase/firestore";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import { GiCircleClaws } from 'react-icons/gi';
import { IoChatboxEllipses } from 'react-icons/io5';
import Link from 'next/link';


function Sidebar() {

    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const userChatRef = query(collection(db, "chats"),
        where("users", "array-contains", user?.email));
    const [chatsSnapshot] = useCollection(userChatRef);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (EmailValidator.validate(email) && !chatAlreadyExits(email) && email !== user?.email) {
            try {
                const docRef = await addDoc(collection(db, "chats"), {
                    users: [user?.email, email],
                    // messages: []
                });
                // console.log("Chat created with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding chat document: ", e);
            }
        }
        setEmail("");
        handleClose();
    };

    const chatAlreadyExits = (recipientEmail: string) =>
        !!chatsSnapshot?.docs.find((chat) => chat.data().users?.find((user: any) => user === recipientEmail)?.length > 0)


    return (
        <section className='px-4 py-4 sm:px-4 sm:py-8 w-full sm:w-72 lg:w-96 h-screen border-r fixed top-0 left-0 bg-white z-50'>

            <header className='flex items-center justify-between w-full'>
                <Link href='/profile'>
                    <div className=''>
                        <Avatar src={user?.photoURL!} alt={user?.displayName!} className='cursor-pointer'></Avatar>
                    </div>
                </Link>
                <div className='flex items-center space-x-4'>
                    <BsPeopleFill title='Communities' className='text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer' />
                    <GiCircleClaws title='Status' className='text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer' />
                    <IoChatboxEllipses title='New Chat' className='text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer' />
                    <BsThreeDotsVertical title='More' className='text-gray-500 hover:text-gray-600 w-5 h-5 cursor-pointer' />
                </div>
            </header>
            <div className='my-4 flex items-center w-full space-x-2 border border-white px-4 py-2 rounded-md hover:border-primary focus-within:border-primary'>
                <BiSearchAlt2 className='text-gray-700 w-6 h-6 cursor-pointer' />
                <input
                    type="search"
                    id='search'
                    placeholder='Search chats'
                    className='outline-none flex-grow'
                />
            </div>
            <div className='my-4 w-full'>
                <button onClick={handleOpen} type='button' className='w-full text-gray-900 font-medium rounded-md active:scale-95 transition-transform text-sm py-3 my-2 hover:bg-primary hover:text-white border'>
                    Start a new chat
                </button>
            </div>
            <Modal open={open} onClose={handleClose} className='border rounded-lg'>
                <form onSubmit={handleSubmit} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-6 w-80 px-8 rounded-lg shadow-lg'>
                    <h2 className='text-gray-900 font-medium mb-4'>Create a new chat</h2>
                    <TextField
                        id="email-input"
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        color="success"
                        size="small"
                    />
                    <div className='flex items-center mt-4 space-x-4'>
                        <button type='submit' className='px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 font-medium text-sm shadow-md shadow-green-500/30'>
                            Create
                        </button>
                        <button className='px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-medium text-sm shadow-md shadow-red-500/30' onClick={handleClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <div className='flex flex-col items-center w-full space-y-2'>
                {chatsSnapshot?.docs?.map((chat: any) => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))}
            </div>

        </section >
    )
}

export default Sidebar
