import React, { ReactNode } from 'react';
import Link from 'next/link';

type linkprops = {
  link: string;
  children: ReactNode;
  classNames?: string;
};

type btnprops = {
  onClick: () => void;
  children: ReactNode;
  classNames?: string;
};

export const ButtonLink = ({
  link = '/test',
  children = 'test',
  classNames,
}: linkprops) => {
  return (
    <Link href={link}>
      <a
        className={`${classNames} bg-blue-500 text-zinc-50 rounded-md py-2 px-4 font-bold`}
      >
        {children}
      </a>
    </Link>
  );
};

export const Button = ({
  onClick,
  children = 'test',
  classNames,
}: btnprops) => {
  return (
    <button
      onClick={onClick}
      className={`${classNames} text-blue-500 bg-zinc-200 rounded-md py-2 px-4 font-bold`}
    >
      {children}
    </button>
  );
};
