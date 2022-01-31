import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button } from '../../components/elements/Button';
import Layout from '../../components/layout';
import FullLoader from '../../components/sections/FullLoader';
export default function New() {
  const router = useRouter();
  const { data, status } = useSession();
  const [creating, setCreating] = useState(false);

  if (status == 'loading' || creating) {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    );
  }
  if (status == 'unauthenticated') {
    router.replace('api/auth/signin');
  }

  const username = data.user.name ? data.user.name : data.user.email;
  const id = data.user.id;
  const now = new Date(Date.now());
  const user = {
    username,
    id,
    image: data.user.image
      ? data.user.image
      : `https://eu.ui-avatars.com/api/?name=${username}`,
    joined: now,
  };

  const create = async () => {
    setCreating(true);
    const date = new Date(Date.now());
    date.setDate(date.getDate() + 1); // setter bare datoen til en dag frem i tid for debug purposes
    const data = {
      tid: null,
      user,
      date: date.toISOString(),
    };
    const response = await axios.put('/api/tacoday', data);
    router.push(`/tacoday/${response.data.tid}`);
    setCreating(false);
  };

  return (
    <Layout>
      <Button
        onClick={() => {
          create();
        }}
      >
        Create Tacoday
      </Button>
    </Layout>
  );
}
