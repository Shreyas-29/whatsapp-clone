import type { NextPage } from 'next';
import Head from 'next/head';
import { HomeScreen, Sidebar } from '../components';

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>WhatsApp</title>
        <link rel="icon" href="/whatsapp.png" />
      </Head>

      <main className='flex flex-row items-stretch justify-center relative h-screen'>
        <Sidebar />
        <HomeScreen />
      </main>
    </div>
  )
}

export default Home
