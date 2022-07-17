import { getPrismicClient } from '../../prismicio';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../components/Header';

import { FiUser, FiCalendar } from 'react-icons/fi';

import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postsResult = await fetch(`${nextPage}`).then(response =>
      response.json()
    );

    setNextPage(postsResult.next_page);
    setCurrentPage(postsResult.page);

    const newPosts = postsResult.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.content}>
        {posts.map(post => (
          <a key={post.uid} href={`/post/${post.uid}`}>
            <div className={styles.post}>
              <h2>{post.data.title}</h2>
              <h6>{post.data.subtitle}</h6>

              <div className={styles.info}>
                <div>
                  <FiCalendar width={20} color="#bbb" />
                  <p>{post.first_publication_date}</p>
                </div>
                <div>
                  <FiUser width={20} color="#bbb" />
                  <p>{post.data.author}</p>
                </div>
              </div>
            </div>
          </a>
        ))}

        {!!nextPage && (
          <button
            type="button"
            className={styles.load}
            onClick={() => handleNextPage()}
          >
            Carregar mais posts...
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 4 });

  const posts = postsResponse.results?.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: [...posts],
  };

  return {
    props: {
      postsPagination,
    },
  };
};
