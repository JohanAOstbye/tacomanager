import { useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/layout';
import FullLoader from '../../components/sections/FullLoader';
export default function New() {
  const router = useRouter();
  const session = useSession();
  if (session.status == 'loading') {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    );
  }
  if (session.status == 'unauthenticated') {
    router.push('api/auth/signin');
  }
  return <Layout>new</Layout>;
}
