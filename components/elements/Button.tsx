import React, { ReactNode } from 'react'
import Link from 'next/link'

type linkprops = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  link: string
  children: ReactNode
  classNames?: string
  primary?: boolean
  error?: boolean
}

type btnprops = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  classNames?: string
  primary?: boolean
  error?: boolean
}

export const ButtonLink = ({
  link = '/test',
  children = 'test',
  classNames,
}: linkprops) => {
  return (
    <Link href={link}>
      <a
        className={`${classNames} bg-blue-500 text-zinc-50 rounded-sm py-2 px-4 font-bold`}
      >
        {children}
      </a>
    </Link>
  )
}

export const Button = ({
  onClick,
  children = 'test',
  classNames,
}: btnprops) => {
  return (
    <button
      onClick={onClick}
      className={`${classNames} text-blue-500 bg-zinc-200 rounded-sm py-2 px-4 font-bold`}
    >
      {children}
    </button>
  )
}
