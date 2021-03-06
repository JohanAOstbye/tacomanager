import React, { ReactNode } from 'react'
import Head from './Head'
import Footer from './Footer'
import Nav from './Nav'

type Props = {
  children?: ReactNode
  className?: string
}

const Layout = ({ children, className }: Props) => {
  return (
    <div
      className={`${className} text-gray-700 flex flex-col items-center justify-center min-h-screen max-w font-montserrat `}
    >
      <Head title="Taco" />
      <Nav />
      <main className="flex flex-col items-center justify-center flex-1 px-5 m-5 my-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
