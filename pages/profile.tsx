import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import React, { useState } from 'react';
import { Button } from '../components/elements/Button';
import Layout from '../components/layout';
import Router from 'next/router';
import FullLoader from '../components/sections/FullLoader';
import axios from 'axios';

const profile = () => {
  const [ses, setSes] = useState(null);
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

  const getSes = () => {
    const newses = axios.get('/api/profile', { withCredentials: true });
    setSes(newses);
  };

  return (
    <Layout>
      {/* <div>{JSON.stringify(session, null, 2)}</div>*/}
      <div>{JSON.stringify(ses, null, 2)}</div>
      <Button
        onClick={() => {
          getSes();
        }}
      >
        get session
      </Button>
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
