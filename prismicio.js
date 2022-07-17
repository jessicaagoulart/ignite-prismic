import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import sm from './sm.json';

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case 'Home':
      return '/';
    case 'page':
      return `/${doc.uid}`;
    default:
      return null;
  }
}

// This factory function allows smooth preview setup
export function getPrismicClient(config = {}) {
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.REACT_APP_PRISMIC_ACCESS_TOKEN,
    ...config,
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}
