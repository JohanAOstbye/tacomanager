import axios from 'axios'
import Image from 'next/image'
import { getSession, signIn, useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { FaCalendarDay, FaClock, FaShareAlt } from 'react-icons/fa'
import { Button, ButtonLink } from '../../../components/elements/Button'
import Loading from '../../../components/elements/Loading'
import Layout from '../../../components/layout'
import NoTacoday from '../../../components/sections/NoTacoday'
import { dateformatter } from '../../../lib/formatting'
import clientPromise from '../../../lib/mongodb'
import { displayuser, tacoday } from '../../../types/types'

const Tacoday = (props: { tacoday }) => {
  const [tacoday, setTacoday] = useState<tacoday>({
    ...JSON.parse(props.tacoday),
    date: new Date(JSON.parse(props.tacoday)['date']),
  })
  const [processing, setProcessing] = useState(false)
  const [tooltip, setTooltip] = useState<'hidden' | 'visible'>('hidden')
  const { data: session, status } = useSession()

  // if tacoday cant be found
  if (!tacoday._id) {
    return <NoTacoday tid={tacoday.tid} />
  }

  // check if the current user is attending the tacoday
  const attending =
    session &&
    tacoday.attendees.some((attendee) => attendee.id == session.user.id)

  //function to join or leave tacoday
  const attend = async (join: boolean) => {
    setProcessing(true)

    const data = {
      tid: tacoday.tid,
    }

    let response
    if (join) {
      response = await axios.put('/api/tacoday/attendees', data)
    } else {
      response = await axios.post('/api/tacoday/attendees', data)
    }

    setTacoday({
      ...response.data,
      date: new Date(response.data.date),
    })
    setProcessing(false)
  }

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  // function to copy url or share
  const share = () => {
    if (
      navigator.share &&
      navigator.canShare({
        title: `Tæc på ${dateformatter.day(tacoday.date)}`,
        text: `${session.user.name} inviter på tday:)`,
        url: window.location.href,
      })
    ) {
      navigator.share({
        title: `Tæc på ${dateformatter.day(tacoday.date)}`,
        text: `${session.user.name} inviter på tday:)`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(function () {
        setTooltip('visible')
        delay(1700).then(() => setTooltip('hidden'))
      })
    }
  }

  return (
    <Layout>
      <section className=" max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg">
        <div className="flex sm:items-center flex-col sm:flex-row justify-between w-full">
          <div className="mb-2 truncate">
            <h1 className="w-full text-2xl md:text-3xl text-left font-bold">
              Taco på {dateformatter.day(tacoday.date)}
            </h1>
            <div id="clock" className="flex items-center truncate">
              <FaClock className="mr-2" />
              {dateformatter.time(tacoday.date)}
              <FaCalendarDay className="ml-5 mr-2" />
              <span className="hidden xs:block truncate">
                {dateformatter.long(tacoday.date)}
              </span>
              <span className="xs:hidden truncate">
                {dateformatter.medium(tacoday.date)}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <p className="w-fit mr-3">
                Antall påmeldte: {tacoday.attendees.length}
              </p>
              <button
                className="flex items-center relative"
                onClick={() => share()}
              >
                del <FaShareAlt className="ml-1" />
                <div
                  className={`tooltip ${tooltip} bg-zinc-700 text-zinc-50 absolute z-50 px-1.5 rounded top-0 right-[115%] `}
                >
                  copied
                </div>
              </button>
            </div>
          </div>
          <div className="flex sm:flex-col min-w-max">
            <Button
              primary
              onClick={() => {
                if (status == 'authenticated') {
                  attend(!attending)
                } else {
                  signIn(null, {
                    callbackUrl: `/tacoday/${tacoday.tid}?join=true`,
                  })
                }
              }}
              classNames="m-1 flex justify-center"
            >
              {processing ? (
                <Loading white />
              ) : attending ? (
                'Yeet meg:('
              ) : (
                'Bli med'
              )}
            </Button>
            {status == 'authenticated' ? (
              <ButtonLink
                primary={false}
                link={`/tacoday/${tacoday.tid}/change/`}
                classNames="my-1 flex justify-center bg-zinc-200"
              >
                Endre
              </ButtonLink>
            ) : (
              ''
            )}
          </div>
        </div>

        <ul className="my-4 flex flex-col items-center justify-center w-full">
          {tacoday.attendees.map((attendee: displayuser) => {
            attendee.joined = new Date(attendee.joined)

            return (
              <li
                className="flex justify-between items-center w-full my-1.5"
                key={attendee.id}
              >
                <div className="flex items-center">
                  <div className=" relative w-8 h-8 rounded-full mr-1.5">
                    <Image
                      src={attendee.image}
                      alt="profile picture"
                      layout="fill"
                    />
                  </div>
                  {attendee.displayname}
                </div>
                <div className="block sm:hidden opacity-50 truncate ">
                  {dateformatter.short_wtime(attendee.joined)}
                </div>
                <div className="hidden sm:block opacity-50 overflow-hidden">
                  Joined: {dateformatter.medium_wtime(attendee.joined)}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </Layout>
  )
}

export default Tacoday

export async function getServerSideProps(ctx) {
  const { params, query } = ctx
  const client = await clientPromise
  const tacoday = await client
    .db()
    .collection<tacoday>('tacodays')
    .findOne({ tid: params.id })

  if (!tacoday) {
    return {
      props: {
        tacoday: JSON.stringify({
          _id: null,
          tid: params.id,
          date: new Date(),
          attendees: [],
          creator: null,
        }),
      },
    }
  }

  const session = await getSession(ctx)

  if (query.join && tacoday.attendees.some((e) => e.id == session.user.id)) {
    const user: displayuser = {
      displayname: session.user.displayname,
      id: session.user.id,
      image: session.user.image,
      joined: new Date(Date.now()),
    }
    client
      .db()
      .collection<tacoday>('tacodays')
      .findOneAndUpdate(
        { tid: params.id },
        {
          $push: {
            attendees: user,
          },
        }
      )
    tacoday.attendees = (
      await client
        .db()
        .collection<tacoday>('tacodays')
        .findOne({ tid: params.id })
    ).attendees
  }

  return {
    props: {
      tacoday: JSON.stringify(tacoday),
    },
  }
}
