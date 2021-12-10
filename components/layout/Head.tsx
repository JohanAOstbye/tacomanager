import Head from 'next/head';

type Props = {
  title?: string;
};

const CustomHead = ({ title }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
  );
};

export default CustomHead;
