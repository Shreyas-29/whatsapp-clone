import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Avatar } from '@mui/material';
import { BiDotsVerticalRounded, BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import { DocumentData, QuerySnapshot, addDoc, collection, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { doc, serverTimestamp } from "firebase/firestore";
import { BsImage } from 'react-icons/bs';
import { MdMic } from 'react-icons/md';
import { HiArrowLeft } from 'react-icons/hi';
import { IoHappyOutline, IoSendSharp } from 'react-icons/io5';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import Message from './Message';

interface Props {
  chat: any,
  messages: any
}

function ChatsScreen({ chat, messages }: Props) {


  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recipient, setRecipient] = useState<DocumentData | null>(null);
  const [recipientSnapshot, setRecipientSnapshot] = useState<QuerySnapshot<DocumentData> | null>(null);
  const endOfMessageRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [messagesSnapshot] = useCollection(
    query(
      // @ts-ignore
      collection(db, "chats", router?.query?.id, "messages"),
      orderBy("timestamp", "asc")
    )
  );

  useEffect(() => {
    const getRecipient = async () => {
      const recipientQuery = query(collection(db, "users"), where("email", "==", getRecipientEmail(chat?.users!, user)));
      const recipientSnapshot = await getDocs(recipientQuery);
      setRecipient(recipientSnapshot.docs[0]?.data() ?? null);
    }
    getRecipient();
  }, [chat?.users, user]);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot?.docs?.map((message: any) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages)?.map((message: any) => (
        <Message key={message?.id} user={message?.user} message={message} />
      ))
    }
  };

  const isUserOnline = (lastSeen: Date) => {
    const now = new Date();
    const diff = (now.getTime() - lastSeen.getTime()) / 1000;
    return diff < 10; // return true if lastSeen is within the last 5 minutes (300 seconds)
  }

  useEffect(() => {
    const inputField = document.getElementById("input-field");
    inputField?.addEventListener("focus", scrollToBottom);
    return () => {
      inputField?.removeEventListener("focus", scrollToBottom);
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    await addDoc(collection(doc(collection(db, "chats"), router.query.id), "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user?.email,
      photoURL: user?.photoURL
    });

    await setDoc(doc(collection(db, "users"), user?.uid), {
      lastSeen: serverTimestamp(),
    }, { merge: true });

    setInput("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    endOfMessageRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToBottomOnFocus = () => {
    messagesRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const recipientEmail: any = getRecipientEmail(chat?.users!, user);
  const recipientQuery = query(collection(db, "users"), where("email", "==", recipientEmail));

  useEffect(() => {
    const unsubscribe = onSnapshot(recipientQuery, (snapshot) => {
      setRecipientSnapshot(snapshot);
    });
    return () => unsubscribe();
  }, [recipientQuery]);

  return (
    <section className='w-full h-full border-l relative'>
      <header className='fixed top-0 left-0 lg:left-96 right-0 bg-teal sm:bg-white pt-4 pb-4 px-4 z-50 shadow'>
        {/* <header className='sticky top-0 h-28 bg-white pt-8 pb-4 px-4 z-50 shadow'> */}
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center cursor-pointer'>
            <div onClick={() => router.push('/')} className='p-2 rounded-full sm:hover:bg-secondary cursor-pointer w-9 h-9 flex items-center mr-1'>
              <HiArrowLeft className='w-6 h-6 text-white sm:text-gray-700 cursor-pointer' />
            </div>
            {recipient ? (
              <Avatar src={recipient?.photoURL!} className='cursor-pointer mr-2'></Avatar>
            ) : (
              <Avatar className='cursor-pointer mr-2'>{recipientEmail[0]}</Avatar>
            )}
            <div className='flex flex-col items-start relative'>
              <h4 className='text-white w-40 sm:w-full overflow-hidden sm:text-gray-900 text-sm font-medium'>
                {recipientEmail}
              </h4>
              {/* {recipientSnapshot ? (
                <p className='text-gray-200 sm:text-gray-400 text-xs flex space-x-1'>

                  {recipient?.lastSeen?.toDate() ? (
                    <>
                      <p>Last seen: </p> {' '}
                      <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                    </>
                  ) :
                    (
                      <p className='text-gray-200 sm:text-gray-400 text-xs'>
                        Offline
                      </p>
                    )
                  }
                </p>
              ) : (
                <p className='text-gray-200 sm:text-gray-400 text-xs'>
                  Unavaliable
                </p>
              )} */}
              {recipientSnapshot ? (
                <p className='text-gray-200 sm:text-gray-400 text-xs flex space-x-1'>
                  {recipient?.lastSeen?.toDate() ? (
                    <>
                      {isUserOnline(recipient?.lastSeen?.toDate()) ? (
                        <p className='text-green-400'>Online</p>
                      ) : (
                        <>
                          <p>Last seen: </p> {' '}
                          <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        </>
                      )}
                    </>
                  ) :
                    (
                      <p className='text-gray-200 sm:text-gray-400 text-xs'>
                        Offline
                      </p>
                    )}
                </p>
              ) : (
                <p className='text-gray-200 sm:text-gray-400 text-xs'>
                  Unavailable
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center space-x-4 flex-shrink-0 z-40'>
            <BiSearch className='w-5 h-5 text-white sm:text-gray-700 cursor-pointer' />
            <BiDotsVerticalRounded className='w-5 h-5 text-white sm:text-gray-700 cursor-pointer' />
          </div>
          <div className='h-16 w-28 bg-gradient-to-l from-teal border-white absolute z-10 right-16 top-0 inline sm:hidden'></div>
        </div>
      </header>

      <div ref={messagesRef} className='pb-8 pt-24 px-4 w-full min-h-screen bg-center' style={{ backgroundImage: `url('https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg')` }}>
        {showMessages()}
        <div ref={endOfMessageRef}></div>
      </div>

      <div className='sticky bottom-0 py-4 px-4 flex items-center w-full space-x-1 sm:space-x-2.5 bg-white'>
        <div className='hidden p-2 rounded-full hover:bg-secondary cursor-pointer w-10 h-10 lg:flex items-center'>
          <IoHappyOutline className='w-7 h-7 text-gray-700 cursor-pointer' />
        </div>
        <div className='p-2.5 rounded-full hover:bg-secondary cursor-pointer w-10 h-10 hidden lg:flex items-center'>
          <BsImage className='w-6 h-6 text-gray-700 cursor-pointer' />
        </div>
        <form onSubmit={sendMessage} className='flex items-center flex-1 h-10 space-x-2.5'>
          <input
            type="text"
            id="input-field"
            value={input}
            onFocus={scrollToBottomOnFocus}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message'
            className={`border flex-1 rounded-md px-4 py-1 sm:py-2 outline-none hover:border-teal focus-within:border-teal`}
          />
          {/*  */}
          {input ? (
            <button type='submit' className='p-2 w-9 h-9 rounded-full bg-teal flex items-center'>
              <IoSendSharp className='w-5 h-5 text-white' />
            </button>
          ) : (
            <div className='p-2.5 rounded-full hover:bg-secondary cursor-pointer w-10 h-10 flex lg:hidden items-center'>
              <MdMic className='w-7 h-7 text-gray-700 cursor-pointer' />
            </div>
          )}
        </form>
        <div className='p-2.5 rounded-full hover:bg-secondary cursor-pointer w-10 h-10 hidden lg:flex items-center'>
          <MdMic className='w-7 h-7 text-gray-700 cursor-pointer' />
        </div>
      </div>

    </section>
  )
}

export default ChatsScreen
{/* <div className='pt-8 pb-24 px-4 w-full h-full bg-[#e5ded8]'> */ }