import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button } from './Button'

const Input = (props: {
  placeholder: string
  btnText?: string
  onClick?: () => void
}) => {
  const router = useRouter()
  const [text, setText] = useState('')

  const formatted = (text) =>
    text == ''
      ? ''
      : text.length < 4
      ? text
      : text.slice(0, 3) + '-' + text.slice(3)

  return (
    <div className=" max-w-sm flex justify-between items-center border-b border-blue-500 py-2 mb-10 px-2">
      <input
        className="appearance-none bg-transparent border-none w-1/3 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="text"
        placeholder={props.placeholder}
        aria-label="Full name"
        value={formatted(text)}
        onChange={(e) => {
          if (e.target.value.replace('-', '').length < 7)
            setText(e.target.value.replace('-', ''))
        }}
      />
      {props.btnText ? (
        <Button
          primary={false}
          onClick={() => router.push(`/tacoday/${text}`)}
          className=""
        >
          {props.btnText}
        </Button>
      ) : (
        ''
      )}
    </div>
  )
}

export default Input
