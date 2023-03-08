import React, { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Loading } from '../components';
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import LoginPage from './login';


function MyApp({ Component, pageProps }: AppProps) {

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const { displayName, email, photoURL, uid } = user;

      const userRef = doc(collection(db, "users"), uid);

      setDoc(
        userRef,
        {
          name: displayName,
          email,
          lastSeen: serverTimestamp(),
          photoURL,
        },
        { merge: true }
      ).catch((error) => {
        console.error("Error updating user data: ", error);
      });
    }
  }, [user]);


  if (loading) return <Loading />;
  if (!user) return <LoginPage />;


  return (
    <Component {...pageProps} />
  )
}

export default MyApp
