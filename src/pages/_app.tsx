import { AppProps } from 'next/app';
import Link from 'next/link';
import { PrismicProvider } from '@prismicio/react';
import { PrismicPreview } from '@prismicio/next';
import { linkResolver, repositoryName } from '../../prismicio';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
