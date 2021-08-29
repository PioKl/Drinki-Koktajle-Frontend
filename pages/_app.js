import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import '@/styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp