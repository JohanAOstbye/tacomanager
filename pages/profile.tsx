import { getSession, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button, ButtonLink } from '../components/elements/Button'
import Layout from '../components/layout'
import Router from 'next/router'
import FullLoader from '../components/sections/FullLoader'
import axios from 'axios'
import clientPromise from '../lib/mongodb'
import { tacoday } from '../types/types'
import { dateformatter } from '../lib/formatting'
import Image from 'next/image'

const Profile = (props: { tacodays: string }) => {
  const tacodays: [{ tid: string; date: Date; creator: string }] | [] =
    JSON.parse(props.tacodays)

  const { data: session, status } = useSession()
  if (status == 'loading') {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    )
  }
  if (status == 'unauthenticated') {
    Router.push('api/auth/signin')
  }

  const reloadSession = () => {
    const event = new Event('visibilitychange')
    document.dispatchEvent(event)
  }

  return (
    <Layout>
      <section className=" max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg">
        <div className="flex w-full justify-between">
          <div className="">
            <h1 className="w-full text-xl md:text-2xl font-bold mb-1.5">
              Hei
              {session && session.user && session.user.name
                ? `, ${session.user.name}`
                : ''}
            </h1>
            <p className="text-sm">diggg er kult</p>
          </div>
          <div className="rounded-xl w-20 h-20 relative">
            <Image
              src={session.user.image}
              alt="profile picture"
              layout="fill"
            ></Image>
          </div>
        </div>
        {tacodays.length !== 0 ? (
          <div className="w-full">
            <p>Dine kommende tacodager:</p>
            <div>
              {tacodays.map((tacoday, index) => (
                <div
                  key={index}
                  className="bg-white my-2 rounded p-1.5 flex w-full justify-between"
                >
                  <div className="truncate pr-5">
                    <p className="truncate ">Tacoday with {tacoday.creator}</p>
                    <p className="text-sm text-gray-500">
                      {dateformatter.medium_wtime(new Date(tacoday.date))}
                    </p>
                  </div>
                  <ButtonLink link={'/tacoday/' + tacoday.tid}>Gå</ButtonLink>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="flex justify-between w-full my-5">
          <Button
            onClick={() => {
              axios.put('/api/profile/set-image').then(() => reloadSession())
            }}
          >
            Endre butt
          </Button>
          <Button onClick={() => signOut({ callbackUrl: '/' })}>Log ut</Button>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  const client = await clientPromise

  const res = await client
    .db()
    .collection<tacoday>('tacodays')
    .find({ attendees: { $elemMatch: { id: session.user.id } } })
    .toArray()

  const tacodays = res.map((tacoday) => {
    const day = {
      tid: tacoday.tid,
      date: tacoday.date,
      creator: tacoday.creator,
    }
    return day
  })

  return {
    props: {
      tacodays: JSON.stringify(tacodays),
    },
  }
}

export default Profile
