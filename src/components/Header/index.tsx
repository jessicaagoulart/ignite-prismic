import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <img src="/logo.svg" width={260} height={30} alt="logo" />
        </a>
      </Link>
    </header>
  );
}
