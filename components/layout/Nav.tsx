import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import taco from '../../public/images/taco.svg'

const Nav = () => {
  const { data: session } = useSession()
  return (
    <div className="max-w-7xl w-full h-16 flex items-center justify-between">
      <Link href="/">
        <a className={`font-bold p-3 m-2 h-16 w-24`}>
          <Image src={taco} objectFit="contain" alt="Home | Tacologo" />
        </a>
      </Link>
      <div className="truncate">
        <Link href={'/'}>
          <a className={`font-bold p-3 m-2`}>Home</a>
        </Link>
        <Link href={session ? '/profile' : '/api/auth/signin'}>
          <a className={`font-bold p-3 m-2 truncate`}>
            {session ? session.user.displayname : 'sign in'}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Nav
