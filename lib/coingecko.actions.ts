"use server";

import qs from "query-string";

// const BASE_URL = process.env.COINGECKO_BASE_URL;
// const API_KEY = process.env.COINGECKO_API_KEY;

const BASE_URL = process.env.COINGECKO_JSMASTERY_BASE_URL;
const API_KEY = process.env.COINGECKO_JSMASTERY_API_KEY;

if (!BASE_URL) throw new Error("Could not get base URL");
if (!API_KEY) throw new Error("Could not get API key");

// https://demo-api.coingecko.com/api/
// such as
// https://demo-api.coingecko.com/api/coins/id?

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    headers: {
      // "x-cg-demo-api-key": API_KEY,
      "x-cg-pro-api-key": API_KEY, // -> using pro api with jsmastery's key
      "Content-Type": "application/json"
    } as Record<string, string>,
    next: { revalidate }
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || response.statusText}`
    );
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: ""
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );
      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id }
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query.trim()) return [];

  // Step 1: Search coins
  const searchData = await fetcher<{
    coins: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number | null;
      thumb: string;
      large: string;
    }[];
  }>("search", {
    query: query.trim()
  });

  const coins = searchData.coins.slice(0, 10);

  if (!coins.length) return [];

  // Ambil ID untuk request kedua
  const ids = coins.map((coin) => coin.id).join(",");

  // Step 2: Get market data
  const marketData = await fetcher<CoinMarketData[]>("coins/markets", {
    vs_currency: "usd",
    ids,
    sparkline: false
  });

  // Merge search data + market data
  return coins.map((coin) => {
    const market = marketData.find((item) => item.id === coin.id);

    return {
      ...coin,
      data: {
        price: market?.current_price,
        price_change_percentage_24h: market?.price_change_percentage_24h ?? 0
      }
    };
  });
}

export async function getTopGainersLosers() {
  const data = await fetcher<{
    top_gainers: TopGainersLosersResponse[];
    top_losers: TopGainersLosersResponse[];
  }>(
    "coins/top_gainers_losers",
    {
      vs_currency: "usd",
      duration: "24h",
      price_change_percentage: "1h",
      top_coins: 1000
    },
    300
  );

  return data;
}