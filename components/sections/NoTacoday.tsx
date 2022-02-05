import React from 'react';
import { ButtonLink } from '../elements/Button';
import Layout from '../layout';

const NoTacoday = (props: { tid: string }) => {
  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <h2 className='text-xl font-semibold mb-1 mt-5'>Tacoerror</h2>
        <p className='w-full text-center'>
          Tacoday med id{' '}
          <span className=' bg-slate-300 px-1 rounded-sm font-bold'>
            {props.tid}
          </span>{' '}
          finnes ikke
        </p>
        <ButtonLink link='/' classNames='mt-6'>
          Returner hjem
        </ButtonLink>
      </div>
    </Layout>
  );
};

export default NoTacoday;
