import Link from "next/link";
import { Button } from "@/components/ui/button";

const Introduction = () => {
  return (
    <section id="introduction">
      <div className="content">
        <p className="eyebrow">Get Started</p>

        <h1 className="title">
          Welcome to CryptoLens
        </h1>

        <p className="description">
          Track cryptocurrency prices, explore market trends, and
          discover the latest insights from the crypto market in one place.
        </p>

        <div className="actions">
          <button className="button primary">
            <Link href="#market-overview">
              Explore Markets
            </Link>
          </button>

          <button className="button secondary">
            <Link href="/pricing">
              Go Pro
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Introduction;