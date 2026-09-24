"use client";

import { useState, useEffect } from "react";
import { useDebounce, useKey } from "react-use";
import useSWR from "swr";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import SearchItem from "@/components/SearchItem";
import { searchCoins } from "@/lib/coingecko.actions";
import { SearchIcon } from "lucide-react";

const MAX_SEARCH_RESULTS = 10;
const MAX_TRENDING_COINS = 10;

const SearchModal = ({
  initialTrendingCoins = []
}: SearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const router = useRouter();

  // Debounce input agar pencarian tidak dijalankan
  // setiap kali user mengetik satu karakter.
  useDebounce(
    () => {
      setDebouncedQuery(searchQuery.trim());
    },
    300,
    [searchQuery]
  );

  // Hanya melakukan request ketika ada query.
  const {
    data: searchResults = [],
    isLoading,
    isValidating
  } = useSWR(
    debouncedQuery || null,
    searchCoins
  );

  // Ctrl + K / Cmd + K
  useKey("k", (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  });

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery("");
    setDebouncedQuery("");

    router.push(`/coins/${coinId}`);
  };

  const hasQuery = debouncedQuery.length > 0;

  const displayedTrendingCoins = initialTrendingCoins.slice(
    0,
    MAX_TRENDING_COINS
  );

  const displayedSearchResults = searchResults.slice(
    0,
    MAX_SEARCH_RESULTS
  );

  const isSearching = hasQuery && (isLoading || isValidating);

  const showTrendingCoins =
    !hasQuery && displayedTrendingCoins.length > 0;

  const showNoTrendingCoins =
    !hasQuery && displayedTrendingCoins.length === 0;

  const showNoResults =
    hasQuery &&
    !isSearching &&
    displayedSearchResults.length === 0;

  const showSearchResults =
    hasQuery &&
    !isSearching &&
    displayedSearchResults.length > 0;

  return (
    <div id="search-modal">
      <Button variant="ghost" className="trigger" onClick={() => setOpen(true)}>
        <SearchIcon size={18} />
        Search
        <kbd className="kbd">
          <span>Ctrl</span>
          or
          <span className="text-xs">⌘</span>
          <span>+</span>
          <span>K</span>
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="dialog">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for a coin..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="cmd-input"
          />

          <CommandList className="list custom-scrollbar">
            {/* =================================
                TRENDING COINS
            ================================= */}
            {showTrendingCoins && (
              <CommandGroup heading="Trending Coins" className="group">
                {displayedTrendingCoins.map((coin) => (
                  <SearchItem
                    key={coin.item.id}
                    coin={coin.item}
                    onSelect={handleSelect}
                    isActiveName={false}
                  />
                ))}
              </CommandGroup>
            )}

            {/* =================================
                NO TRENDING COINS
            ================================= */}
            {showNoTrendingCoins && (
              <CommandEmpty className="empty">
                No trending coins available.
              </CommandEmpty>
            )}

            {/* =================================
              SEARCHING
            ================================= */}
            {isSearching && (
              <CommandEmpty className="empty">Searching...</CommandEmpty>
            )}

            {/* =================================
              NO SEARCH RESULTS
            ================================= */}
            {showNoResults && (
              <CommandEmpty className="empty">No results found.</CommandEmpty>
            )}

            {/* =================================
              SEARCH RESULTS
            ================================= */}
            {showSearchResults && (
              <CommandGroup
                heading={<p className="heading">Search Results</p>}
                className="group"
              >
                {displayedSearchResults.map((coin) => (
                  <SearchItem
                    key={coin.id}
                    coin={coin}
                    onSelect={handleSelect}
                    isActiveName
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default SearchModal;