import React from 'react'
import Link from 'next/link'

type linkprops = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  link: string
  primary?: boolean
  error?: boolean
}

type btnprops = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean
  error?: boolean
}

export const ButtonLink = ({
  link = '/test',
  children = 'test',
  className,
}: linkprops) => {
  return (
    <Link href={link}>
      <a
        className={`${className} bg-blue-500 text-zinc-50 rounded-sm py-2 px-4 font-bold`}
      >
        {children}
      </a>
    </Link>
  )
}

export const Button = ({ onClick, children = 'test', className }: btnprops) => {
  return (
    <button
      onClick={onClick}
      className={`${className} text-blue-500 bg-white shadow rounded-lg
       py-2 px-4 font-bold`}
    >
      {children}
    </button>
  )
}
