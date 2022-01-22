import React, { useState } from 'react';
import { Button } from './Button';

const Input = (props: { placeholder: string; btnText?: string }) => {
  const [text, setText] = useState('');

  return (
    <div className=' max-w-sm flex justify-between items-center border-b border-blue-500 py-2 mb-3 px-2'>
      <input
        className='appearance-none bg-transparent border-none w-3/5 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
        type='text'
        placeholder={props.placeholder}
        aria-label='Full name'
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      {props.btnText ? <Button onClick={() => {}}>{props.btnText}</Button> : ''}
    </div>
  );
};

export default Input;
