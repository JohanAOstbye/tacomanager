import Loading from '../elements/Loading';
import Layout from '../layout';

const FullLoader = () => (
  <div className='flex flex-col justify-center items-center'>
    <Loading size='xl' />
    <h2 className='text-xl font-semibold mb-1 mt-5'>Loading...</h2>
    <p className='w-1/2 text-center'>
      This may take a few seconds, please don't close this page.
    </p>
  </div>
);

export const FullPageLoader = () => (
  <Layout>
    <FullLoader />
  </Layout>
);

export default FullLoader;
