import React, { ReactNode } from 'react';
import Link from 'next/link';

type linkprops = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  link: string;
  children: ReactNode;
  classNames?: string;
  primary?: boolean;
  error?: boolean;
};

type btnprops = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  classNames?: string;
  primary?: boolean;
  error?: boolean;
};

export const ButtonLink = ({
  link = '/test',
  children = 'test',
  classNames,
  primary = true,
  error = false,
  ...props
}: linkprops) => {
  return (
    <Link href={link}>
      <a
        {...props}
        className={`${classNames} ${
          error
            ? 'bg-red-500 text-zinc-50'
            : primary
            ? 'bg-blue-500 text-zinc-50'
            : 'bg-zinc-200 text-blue-500'
        } rounded-md py-2 px-4 font-bold`}
      >
        {children}
      </a>
    </Link>
  );
};

export const Button = ({
  children = 'test',
  classNames,
  primary = true,
  error = false,
  ...props
}: btnprops) => {
  return (
    <button
      {...props}
      className={`${classNames} ${
        error
          ? 'bg-red-500 text-zinc-50'
          : primary
          ? 'bg-blue-500 text-zinc-50'
          : 'bg-zinc-200 text-blue-500'
      } rounded-md py-2 px-4 font-bold`}
    >
      {children}
    </button>
  );
};
