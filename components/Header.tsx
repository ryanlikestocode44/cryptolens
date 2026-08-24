import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="CryptoLens Logo"
            width={100}
            height={50}
          />
        </Link>
      </div>
    </header>
  );
}

export default Header