import React from 'react';
import { Avatar } from '@mui/material';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

function Chat({ key, id, users }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const recipientEmail = getRecipientEmail(users, user);
    const recipientQuery = query(collection(db, "users"), where("email", "==", recipientEmail));
    const [recipientSnapshot] = useCollection(recipientQuery);

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <div key={key} onClick={enterChat} className='flex items-center space-x-4 py-2 w-full hover:bg-secondary transition-all px-4 rounded-md ease-out cursor-pointer'>
            {recipient ? (
                <Avatar sx={{ width: 35, height: 35 }} src={recipient?.photoURL!} alt={recipient?.displayName!} className='cursor-pointer'></Avatar>
            ) : (
                <Avatar sx={{ width: 35, height: 35 }} className='cursor-pointer'>
                    {recipientEmail[0]}
                </Avatar>
            )}
            <h4 className='text-sm text-gray-800'>
                {recipientEmail}
            </h4>
        </div>
    )
}

export default Chat
