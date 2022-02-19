import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaCalendarDay, FaClock } from 'react-icons/fa'
import { Button } from '../../../components/elements/Button'
import Datepicker from '../../../components/elements/Datepicker'
import Layout from '../../../components/layout'
import FullLoader from '../../../components/sections/FullLoader'
import clientPromise from '../../../lib/mongodb'
import taco from '../../../public/images/taco.svg'

export type RegistrationFormFields = {
  date: Date
}

const ChangeTacoday = (props: { tacoday }) => {
  const router = useRouter()
  if (!props.tacoday) router.push('/')
  const tacoday = JSON.parse(props.tacoday)
  tacoday.date = new Date(tacoday.date)
  const { status } = useSession()
  const [changing, setChanging] = useState(false)
  const { handleSubmit, control } = useForm<RegistrationFormFields>({
    defaultValues: { date: new Date(new Date().setHours(19, 0, 0, 0)) },
  })

  if (status == 'loading' || changing) {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    )
  }
  if (status == 'unauthenticated') {
    router.push('/api/auth/signin')
  }

  const change = async (data: { date: Date }) => {
    setChanging(true)
    await axios
      .post('/api/tacoday', {
        ...data,
        tid: tacoday.tid,
      })
      .then(() => router.push(`/tacoday/${tacoday.tid}`))
    setChanging(false)
  }

  return (
    <Layout>
      <section className=" max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg">
        <div>
          <h1 className="w-full text-2xl text-left font-bold">
            Taco på {tacoday.date.toLocaleString('no', { weekday: 'long' })}
          </h1>
          <div id="clock" className="flex items-center">
            <FaClock className="mr-2" />
            {tacoday.date.toLocaleString('no', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
            <FaCalendarDay className="ml-5 mr-2" />
            {tacoday.date.toLocaleString('no', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(change)}
          className="w-full flex items-center"
        >
          <div className="flex flex-col justify-between">
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, onBlur, value } }) => (
                <Datepicker
                  updateDate={onChange}
                  onBlur={onBlur}
                  date={value}
                  name="date"
                  label="Velg ny dato"
                />
              )}
            />

            <div className="flex  w-full my-5">
              <Button type="submit">Endre taxi</Button>
            </div>
          </div>
          <div className="relative h-64 w-64 flex-g ml-5">
            <Image src={taco} alt="new taco image" layout="fill" />
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default ChangeTacoday

export async function getServerSideProps({ params }) {
  const client = await clientPromise
  const tacoday = await client
    .db()
    .collection('tacodays')
    .findOne({ tid: params.id })

  if (!tacoday) {
    return {
      props: { tacoday: null },
    }
  }

  return {
    props: {
      tacoday: JSON.stringify(tacoday),
    },
  }
}
