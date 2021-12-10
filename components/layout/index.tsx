import React, { ReactNode } from 'react';
import Head from './Head';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className=' text-gray-700 flex flex-col items-center justify-center min-h-screen'>
      <Head title='Taco' />
      <main className='flex flex-col items-center justify-center w-full flex-1 px-5 text-center'>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
