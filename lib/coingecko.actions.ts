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
    const poolData = await fetcher<{ data: PoolData[] }>(
      `/onchain/networks/${network}/tokens/${contractAddress}/pools`
    );

    return poolData.data?.[0] ?? fallback;
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
