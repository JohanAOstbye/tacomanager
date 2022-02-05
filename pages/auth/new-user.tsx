import React from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/elements/Button';
import Layout from '../../components/layout';
import { FullPageLoader } from '../../components/sections/FullLoader';
import axios from 'axios';
import username from '../api/profile/displayname';

const NewUser = () => {
  const { data: session, status } = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({ defaultValues: { username: '' } });

  if (status == 'loading') return <FullPageLoader />;
  if (
    getValues('username') == '' &&
    session &&
    session.user &&
    session.user.name
  )
    setValue('username', session.user.name);

  const onSubmit = async (values: { username: string }) => {
    console.log(encodeURI(values.username));

    axios
      .post(`/api/profile/username`, { username: values.username })
      .then((res) => console.log(res));
  };
  return (
    <Layout>
      <section className=' max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg'>
        <div className='px-5'>
          <h1 className='w-full text-2xl font-bold mb-1.5'>
            Hei
            {session && session.user && session.user.name
              ? `, ${session.user.name}`
              : ''}
          </h1>
          <p className='text-sm'>
            Vi trenger et brukernavn som vil være synlig på tacosidene
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col items-start w-full p-5'
        >
          Brukernavn:
          <input
            className='w-full mb-8 mt-0.5 py-2 px-2 rounded-md '
            {...register('username', {
              validate: (value) => value !== 'admin' || 'Nice try!',
            })}
          />
          {errors.username && errors.username.message}
          <Button type='submit'>Lagre</Button>
        </form>
      </section>
    </Layout>
  );
};

export default NewUser;