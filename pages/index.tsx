import React from 'react'
import Image from 'next/image'
import Layout from '../components/layout'
import taco from '../public/images/taco.svg'
import { ButtonLink } from '../components/elements/Button'
import Input from '../components/elements/Input'

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col-reverse items-center lg:flex-row text-center w-full">
        <div className="flex flex-col max-w-sm">
          <h1 className="text-5xl font-semibold">Taco with da BOIIIS</h1>
          <div className="mx-8 mt-10">
            <ButtonLink link={'/tacoday/new'} classNames="w-full">
              Planlegg en tacokveld
            </ButtonLink>
            <div className="w-full my-4 mx-auto opacity-50">
              <p className="or">eller</p>
            </div>
            <div>
              <p className="text-sm ">
                bruk en kode for å bli med på en tacokveld
              </p>
              <div>
                <Input placeholder={'XXX-XXX'} btnText={'Bli med'} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-black flex justify-center items-center h-40 w-40 md:h-80 md:w-80 relative mx-20">
          <Image src={taco} layout="fill" objectFit="contain" alt="Tacologo" />
        </div>
      </div>
    </Layout>
  )
}
