import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';

function Message({ key, user, message }: any) {

    const [userLoggedIn] = useAuthState(auth);


    return (
        <div key={key} className={`w-fit min-w-[60px] flex font-normal px-2 pt-1 pb- text-sm rounded-lg break-words text-black my-2 relative text-left shadow
        ${user === userLoggedIn?.email ? 'ml-auto text-left bg-[#dcf8c6]' : 'bg-white text-left'
            }`}>
            <p className={``}>
                {message.message.charAt(0).toUpperCase() + message.message.slice(1)}
            </p>
            <span className='float-right pt-2 ml-2 text-[10px] mt-auto text-gray-500'>
                {message?.timestamp ? moment(message?.timestamp).format("LT") : "..."}
            </span>
        </div>
    )
}

export default Message
