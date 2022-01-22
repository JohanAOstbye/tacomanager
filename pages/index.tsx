import React from 'react';
import Image from 'next/image';
import Layout from '../components/layout';
import taco from '../public/images/taco.svg';
import { ButtonLink } from '../components/elements/Button';
import Input from '../components/elements/Input';

export default function Home() {
  return (
    <Layout>
      <div className='flex flex-col-reverse lg:flex-row'>
        <div className='flex flex-col items-center '>
          <h1 className='text-5xl'>Taco with da BOIIIS</h1>
          <p>Super side for alle som skal ha taco</p>
          <div className='mx-8 mt-10'>
            <ButtonLink link={'/new'}>Planlegg en tacokveld</ButtonLink>
            <div className='w-full my-4 mx-auto'>
              <p className='or'>eller</p>
            </div>
            <div>
              <p>bruk en kode for å bli med på en tacokveld</p>
              <div>
                <Input placeholder={'XXX-XXX'} btnText={'bli med'} />
              </div>
            </div>
          </div>
        </div>
        <div className='text-black flex justify-center items-center h-80 w-80 relative mx-10'>
          <Image src={taco} layout='fill' objectFit='contain' />
        </div>
      </div>
    </Layout>
  );
}
