import Image from "next/image";
import { CommandItem } from "@/components/ui/command";
import { cn, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
  const isSearchCoin =
    typeof coin.data.price_change_percentage_24h === "number";

  const priceChange = isSearchCoin
    ? (coin as SearchCoin).data.price_change_percentage_24h
    : (coin as TrendingCoin["item"]).data.price_change_percentage_24h.usd;

  return (
    <CommandItem
      value={coin.id}
      onSelect={() => onSelect(coin.id)}
      className="search-item"
    >
      <div className="coin-info">
        <Image src={coin.thumb} alt={coin.name} width={36} height={36} />

        <div>
          <p
            className={cn("font-bold", {
              "text-white": isActiveName
            })}
          >
            {coin.name}
          </p>

          <span className="coin-symbol">{coin.symbol}</span>
        </div>
      </div>

      <div
        className={cn("coin-change", {
          "text-green-500": priceChange > 0,
          "text-red-500": priceChange < 0
        })}
      >
        {priceChange > 0 ? (
          <TrendingUp size={14} />
        ) : priceChange < 0 ? (
          <TrendingDown size={14} />
        ) : null}
        <span>{formatPercentage(Math.abs(priceChange))}</span>
      </div>
    </CommandItem>
  );
};

export default SearchItem;
