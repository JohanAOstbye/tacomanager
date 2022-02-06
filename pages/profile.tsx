import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';
import { Button } from '../components/elements/Button';
import Layout from '../components/layout';
import Router from 'next/router';
import FullLoader from '../components/sections/FullLoader';

const profile = () => {
  const session = useSession();
  if (session.status == 'loading') {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    );
  }
  if (session.status == 'unauthenticated') {
    Router.push('api/auth/signin');
  }

  return (
    <Layout>
      <div>{JSON.stringify(session, null, 2)}</div>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sing out
      </Button>
    </Layout>
  );
};

export default profile;
