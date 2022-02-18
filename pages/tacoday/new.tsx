import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button } from '../../components/elements/Button'
import Layout from '../../components/layout'
import FullLoader from '../../components/sections/FullLoader'
import Datepicker from '../../components/elements/Datepicker'

export type RegistrationFormFields = {
  date: Date
}

export default function New() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [creating, setCreating] = useState(false)
  const { handleSubmit, control } = useForm<RegistrationFormFields>({
    defaultValues: { date: new Date() },
  })

  if (status == 'loading' || creating) {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    )
  }
  if (status == 'unauthenticated') {
    router.push('/api/auth/signin')
  }

  const create = async (data: { date: Date }) => {
    setCreating(true)
    const response = await axios.put('/api/tacoday', data)

    router.push(`/tacoday/${response.data.tid}`)
    setCreating(false)
  }

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(create)}
        className="form max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg"
      >
        <h1 className="w-full text-xl md:text-2xl font-bold mb-1.5">
          Hei, når blirre tæc??
        </h1>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, onBlur, value } }) => (
            <Datepicker
              updateDate={onChange}
              onBlur={onBlur}
              date={value}
              name="date"
            />
          )}
        />

        <div className="flex justify-end w-full my-5">
          <Button type="submit">tæc</Button>
        </div>
      </form>
    </Layout>
  )
}
