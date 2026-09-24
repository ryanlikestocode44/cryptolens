import { getTopGainersLosers } from '@/lib/coingecko.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from "next/link";

const TopGainersLosers = async () => {
  let data;

  try {
    data = await getTopGainersLosers();
  } catch (error) {
    console.error("Error fetching top gainers and losers:", error);

    return null;
  }

  return (
    <div id="top-gainers-losers">
      <Tabs defaultValue="top-gainers" className="tabs">
        <TabsList variant="line" className="tabs-list">
          <TabsTrigger value="top-gainers"  className="tabs-trigger">Top Gainers</TabsTrigger>

          <TabsTrigger value="top-losers" className="tabs-trigger">Top Losers</TabsTrigger>
        </TabsList>

        <TabsContent value="top-gainers" className="tabs-content">
          {data.top_gainers.slice(0, 5).map((coin) => (
            <Link href={`/coins/${coin.id}`} key={coin.id}>
              <div className="coin-card">
                <div className="coin-info">
                  <Image src={coin.image} alt={coin.name} width={40} height={40} />

                  <div>
                    <p className="coin-name">{coin.name}</p>
                    <span className="coin-symbol">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="coin-data">
                  <p className="coin-price">{formatCurrency(coin.usd)}</p>

                  <p className="coin-change text-green-500">
                    <TrendingUp size={16} className="inline-block mr-1" />
                    {coin.usd_24h_change.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="top-losers" className="tabs-content">
          {data.top_losers.slice(0, 5).map((coin) => (
            <Link href={`/coins/${coin.id}`} key={coin.id}>
              <div className="coin-card">
                <div className="coin-info">
                  <Image src={coin.image} alt={coin.name} width={40} height={40} />

                <div>
                  <p className="coin-name">{coin.name}</p>
                  <span className="coin-symbol">
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="coin-data">
                <p className="coin-price">{formatCurrency(coin.usd)}</p>

                <p className="coin-change text-red-500">
                  <TrendingDown size={16} className="inline-block mr-1" />
                  {coin.usd_24h_change.toFixed(2)}%
                </p>
              </div>
              </div>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopGainersLosers