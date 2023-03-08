import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiArrowLeft, HiOutlineMail, HiPencil } from 'react-icons/hi';
import { MdPhotoCamera } from 'react-icons/md';
import Link from 'next/link';
import TextField from '@mui/material/TextField';

function ProfileScreen({ user, signOut }: any) {

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


  const fileRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setName(parsedUserData.name);
      setEmail(parsedUserData.email);
      setPreviewImage(parsedUserData.previewImage);
    }
  }, []);


  const handleSaveProfile = () => {
    if (!name || !email || !previewImage) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }

    // Otherwise, save the user's data to local storage
    const userData = { name, email, previewImage };
    localStorage.setItem("userData", JSON.stringify(userData));

    setName("");
    setEmail("");
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };




  return (
    <section className='flex-1 flex flex-col items-center justify-center'>
      <header className='flex items-center mb-20 w-full mx-auto bg-primary sm:bg-white py-4 px-4'>
        <Link href={'/'} className='flex items-center'>
          <div className='p-2.5 rounded-full sm:hover:bg-secondary cursor-pointer w-9 h-9 flex items-center mr-2'>
            <HiArrowLeft className='w-6 h-6 text-white sm:text-gray-700 cursor-pointer' />
          </div>
          <h4 className='text-white sm:text-green-900 font-medium text-lg'>
            Profile
          </h4>
        </Link>
      </header>
      <div className='flex flex-col items-center justify-center'>
        {previewImage ? (
          <div onClick={() => fileRef.current?.click()} className='relative cursor-pointer'>
            <input
              type="file"
              hidden
              onChange={handleImageChange}
              ref={fileRef}
            />
            <Image
              src={previewImage}
              alt=''
              unoptimized
              width={500}
              height={500}
              className='w-24 h-24 object-cover rounded-full'
            />
            <MdPhotoCamera className='bg-green-500 p-2 rounded-full text-white w-8 h-8 absolute bottom-0 right-0 z-10 shadow-md' />
          </div>
        ) : (
          <div onClick={() => fileRef.current?.click()} className='relative cursor-pointer'>
            <input
              type="file"
              hidden
              onChange={handleImageChange}
              ref={fileRef}
            />
            <Image
              src={user?.photoURL!}
              alt=''
              unoptimized
              width={500}
              height={500}
              className='w-24 h-24 object-cover rounded-full'
            />
            <MdPhotoCamera className='bg-green-500 p-2 rounded-full text-white w-8 h-8 absolute bottom-0 right-0 z-10 shadow-md' />
          </div>
        )}
        <div className='mt-16 mx-auto w-full flex flex-col items-center max-w-sm'>
          <div className='flex items-start space-x-4 w-full'>
            <BsFillPersonFill className='text-slate-500 w-9 h-9 cursor-pointer' />
            <div className='flex flex-col items-start mb-2'>
              <TextField
                variant="standard"
                type="text"
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.displayName}
                className="block w-full border placeholder:capitalize border-gray-300 rounded-md py-2 px-3 mb-3 outline-none"
              />
              <p className='select-none text-xs mt-2 text-gray-400'>This is not your username or pin. This mame will be visible to your Whatsapp contacts.</p>
            </div>
            <label htmlFor="name">
              <HiPencil className='text-green-500 w-7 h-7 cursor-pointer' />
            </label>
          </div>
          <div className='flex items-start space-x-4 mt-4 w-full'>
            <HiOutlineMail className='text-slate-500 w-8 h-8 cursor-pointer' />
            <TextField
              variant="standard"
              type="text"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user?.email}
              className="block w-full border placeholder:capitalize border-gray-300 rounded-md py-2 px-3 mb-3 outline-none"
            />
            <label htmlFor="email">
              <HiPencil className='text-green-500 w-7 h-7 cursor-pointer' />
            </label>
          </div>
          {error && (
            <p className='text-xs text-red-500 my-2'>
              Make some change to update profile
            </p>
          )}
          <div className='mt-12 w-full'>
            <button onClick={handleSaveProfile} className='w-full bg-primary hover:bg-green-500 hover:shadow-lg active:scale-90 hover:shadow-primary/40 transition-all py-2 rounded-md text-white font-medium'>
              Update profile
            </button>
          </div>
        </div>
        <div className='flex items-center justify-center mt-8 w-full'>
          <button onClick={signOut} className='w-full bg-primary hover:bg-green-500 hover:shadow-lg active:scale-90 hover:shadow-primary/40 transition-all py-2 rounded-md text-white font-medium'>
            Sign out from whatsapp
          </button>
        </div>
      </div>
      {success && (
        <p className='absolute px-4 py-2 rounded-lg bg-white text-primary border bottom-4 shadow-lg'>
          Profile updated successfully!
        </p>
      )}
    </section>
  )
}

export default ProfileScreen
