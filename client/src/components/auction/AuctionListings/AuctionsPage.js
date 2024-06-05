import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Select,
  SelectItem,
  useDisclosure,
  Card,
  Skeleton,
  Checkbox,
} from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import TempHeader from "../../general/navbar/TempHeader";
import SidebarDrawer from "./sidebar-drawer";
import ProductsGrid from "./products-grid";
import ecommerceItems from "./ecommerce-items";
import AuctionListItem from "./auction-list-items";
import FiltersWrapper from "./filters-wrapper";
import { Icon } from "@iconify/react";

const AuctionsPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]); // State for price range with larger upper limit
  const [filtersApplied, setFiltersApplied] = useState(false); // New state to track if filters are applied
  const [sortOption, setSortOption] = useState("newest");
  const [showEndedAuctions, setShowEndedAuctions] = useState(false); // State to toggle showing ended auctions

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "auctions"));
        const fetchedAuctions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          endTime: new Date(doc.data().endTime.seconds * 1000),
          startTime: new Date(doc.data().startTime.seconds * 1000),
        }));

        const sortedAuctions = fetchedAuctions.sort(
          (a, b) => b.startTime - a.startTime
        );
        setAuctions(sortedAuctions);
        setFilteredAuctions(sortedAuctions); // Display all auctions initially
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    if (filtersApplied) {
      let newFilteredAuctions = auctions.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedSizes.length > 0
            ? selectedSizes.includes(auction.size)
            : true) &&
          (selectedColors.length > 0
            ? selectedColors.includes(auction.color)
            : true) &&
          (selectedCondition
            ? auction.condition === selectedCondition
            : true) &&
          (selectedCountry
            ? auction.leagueCountry === selectedCountry
            : true) &&
          (selectedLeague ? auction.league === selectedLeague : true) &&
          auction.currentHighestBid >= priceRange[0] &&
          auction.currentHighestBid <= priceRange[1] &&
          (showEndedAuctions || auction.isLive)
      );
      newFilteredAuctions = sortAuctions(newFilteredAuctions, sortOption);
      setFilteredAuctions(newFilteredAuctions);
    } else {
      setFilteredAuctions(
        sortAuctions(auctions, sortOption).filter(
          (auction) => showEndedAuctions || auction.isLive
        )
      ); // Display sorted and filtered auctions if no filters are applied
    }
  }, [
    searchTerm,
    selectedSizes,
    selectedColors,
    selectedCondition,
    selectedCountry,
    selectedLeague,
    priceRange,
    filtersApplied,
    auctions,
    sortOption,
    showEndedAuctions,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFiltersApplied(true);
  };

  const handleColorChange = (colors) => {
    setSelectedColors(colors);
    setFiltersApplied(true);
  };

  const handleSizeChange = (sizes) => {
    setSelectedSizes(sizes);
    setFiltersApplied(true);
  };

  const handleConditionChange = (value) => {
    setSelectedCondition(value);
    setFiltersApplied(true);
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setFiltersApplied(true);
  };

  const handleLeagueChange = (value) => {
    setSelectedLeague(value);
    setFiltersApplied(true);
  };

  const handlePriceRangeChange = useCallback((range) => {
    setPriceRange(range);
    setFiltersApplied(true);
  }, []);

  const handleSortChange = (key) => {
    setSortOption(key);
    setFiltersApplied(true);
  };

  const handleShowEndedAuctionsChange = () => {
    setShowEndedAuctions(!showEndedAuctions);
  };

  const sortAuctions = (auctions, option) => {
    // Function to parse date from different formats
    const parseDate = (date) => {
      if (!date) return new Date("1970-01-01"); // Fallback date for invalid dates
      if (date.toDate) return date.toDate(); // Firestore Timestamp
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? new Date("1970-01-01") : parsedDate; // Check for invalid date
    };

    // Ensure that startTime and endTime are Date objects
    auctions.forEach((auction) => {
      auction.startTime = parseDate(auction.startTime);
      auction.endTime = parseDate(auction.endTime);
    });

    const now = new Date();

    switch (option) {
      case "newest":
        return auctions.sort((a, b) => {
          const diffA = now - a.startTime;
          const diffB = now - b.startTime;
          return diffA - diffB;
        });
      case "price_high_to_low":
        return auctions.sort(
          (a, b) => (a.currentHighestBid || 0) - (b.currentHighestBid || 0)
        );
      case "price_low_to_high":
        return auctions.sort(
          (a, b) => (b.currentHighestBid || 0) - (a.currentHighestBid || 0)
        );
      case "ending_soon":
        return auctions.sort((a, b) => a.endTime - b.endTime);
      case "popular":
        return auctions.sort(
          (a, b) =>
            (b.bidHistory ? b.bidHistory.length : 0) -
            (a.bidHistory ? a.bidHistory.length : 0)
        );
      default:
        return auctions;
    }
  };

  return (
    <div className="max-w-8xl h-full w-full px-2 ">
      <TempHeader isBlackText={true} />

      <div className="flex gap-x-6 pt-24 lg:px-12">
        <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
          <FiltersWrapper
            className="bg-default-50"
            items={ecommerceItems}
            scrollShadowClassName="max-h-full pb-12"
            showActions={false}
            title="Filter"
            onPriceRangeChange={handlePriceRangeChange}
            onSizeChange={handleSizeChange}
            onColorChange={handleColorChange}
          />
        </SidebarDrawer>
        <div className="w-full flex-1 flex-col">
          <header className="relative z-20 flex flex-col gap-2 rounded-medium bg-default-50 px-4 pb-3 pt-2 md:pt-3">
            <div className="flex items-center gap-1 md:hidden md:gap-2">
              <h2 className="text-large font-medium">Auksjoner </h2>
              <span className="text-small text-default-400">
                ({filteredAuctions.length})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex flex-row gap-2">
                <Button
                  className="flex border-default-200 sm:hidden"
                  startContent={
                    <Icon
                      className="text-default-500"
                      height={16}
                      icon="solar:filter-linear"
                      width={16}
                    />
                  }
                  variant="bordered"
                  onPress={onOpen}
                >
                  Filters
                </Button>
                <div className="hidden items-center gap-1 md:flex">
                  <h2 className="text-medium font-medium">Auksjoner</h2>
                  <span className="text-small text-default-400">
                    ({filteredAuctions.length})
                  </span>
                </div>
              </div>

              <Select
                aria-label="Sort by"
                classNames={{
                  base: "items-center justify-end",
                  label:
                    "hidden lg:block text-tiny whitespace-nowrap md:text-small text-default-400",
                  mainWrapper: "max-w-xs",
                }}
                defaultSelectedKeys={["popular"]}
                label="Sorter etter"
                labelPlacement="outside-left"
                placeholder="Velg filter"
                variant="bordered"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <SelectItem key="newest" value="newest">
                  Nyeste
                </SelectItem>
                <SelectItem key="price_low_to_high" value="price_low_to_high">
                  Pris: Høyest først
                </SelectItem>
                <SelectItem key="price_high_to_low" value="price_high_to_low">
                  Pris: Lavest først
                </SelectItem>
                <SelectItem key="ending_soon" value="ending_soon">
                  Ender snart
                </SelectItem>
                <SelectItem key="popular" value="popular">
                  Populære
                </SelectItem>
              </Select>
              <Checkbox size="sm" onChange={handleShowEndedAuctionsChange}>
                Vis ferdige auksjoner
              </Checkbox>
            </div>
          </header>
          <main className="mt-4 h-full w-full overflow-visible px-1">
            <div className="block rounded-medium border-medium border-dashed border-divider">
              <ProductsGrid className="grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredAuctions.length > 0 ? (
                  filteredAuctions.map((auction) => (
                    <AuctionListItem key={auction.id} auction={auction} />
                  ))
                ) : (
                  <div className="grid grid-cols-3">
                    <Card className="w-[300px] space-y-5 p-4" radius="lg">
                      <Skeleton className="rounded-lg">
                        <div className="h-48 rounded-lg bg-default-300"></div>
                      </Skeleton>
                      <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      </div>
                    </Card>

                    <Card className="w-[300px] space-y-5 p-4" radius="lg">
                      <Skeleton className="rounded-lg">
                        <div className="h-48 rounded-lg bg-default-300"></div>
                      </Skeleton>
                      <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      </div>
                    </Card>

                    <Card className="w-[300px] space-y-5 p-4" radius="lg">
                      <Skeleton className="rounded-lg">
                        <div className="h-48 rounded-lg bg-default-300"></div>
                      </Skeleton>
                      <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      </div>
                    </Card>
                  </div>
                )}
              </ProductsGrid>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuctionsPage;
