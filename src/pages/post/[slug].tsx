import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../../prismicio';
import Header from '../../components/Header';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import styles from './post.module.scss';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const formattedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  console.log(formattedDate);

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);

    words.forEach(word => {
      total += word;
    });

    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className={styles.container}>
        <Header />

        <img
          src={post.data.banner.url}
          alt="banner"
          className={styles.banner}
        />

        <main className={styles.content}>
          <h1>{post.data.title}</h1>

          <div className={styles.info}>
            <div>
              <FiCalendar width={20} color="#bbb" />
              <p>{formattedDate}</p>
            </div>
            <div>
              <FiUser width={20} color="#bbb" />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock width={20} color="#bbb" />
              <p>{`${readTime} min`}</p>
            </div>
          </div>

          {post.data.content.map(content => {
            return (
              <article className={styles.paragraph} key={content.heading}>
                <h2>{content.heading}</h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </article>
            );
          })}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});
  const { data } = response;

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: data.title,
      banner: {
        url: data.banner.url,
      },
      author: data.author,
      content: data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };
  return {
    props: {
      post,
    },
  };
};
