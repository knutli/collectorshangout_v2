import React, { useState, useEffect } from "react";
import AuctionCard from "./AuctionCard";
import {
  Input,
  Divider,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../firebase-config";
import "../../styles/auctionsPage.css";
import TempHeader from "../TempHeader";
import {
  SIZES,
  CONDITIONS,
  COUNTRIES,
  LEAGUES,
} from "./AuctionCreateConstants";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "auctions"));
        const fetchedAuctions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          endTime: new Date(doc.data().endTime.seconds * 1000),
        }));

        const sortedAuctions = fetchedAuctions.sort(
          (a, b) => b.endTime - a.endTime
        );

        setAuctions(sortedAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  const filteredAuctions = auctions.filter(
    (auction) =>
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSize ? auction.size === selectedSize : true) &&
      (selectedCondition ? auction.condition === selectedCondition : true) &&
      (selectedCountry ? auction.leagueCountry === selectedCountry : true) &&
      (selectedLeague ? auction.league === selectedLeague : true)
  );

  return (
    <div>
      <TempHeader isBlackText={true} />
      <div className="auctions-page-container">
        <div className="search-filter" style={{ marginBottom: "10px" }}>
          <Input
            type="text"
            placeholder="Søk etter auksjoner..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-controls">
          {/* Size filter dropdown */}
          <Autocomplete
            value={selectedSize}
            onChange={handleSizeChange}
            label="Størrelse"
            className="max-w-xs"
            size="sm"
            variant="bordered"
            selectionMode="multiple"
          >
            {SIZES.map((size) => (
              <AutocompleteItem key={size} value={size}>
                {size}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Condition filter dropdown */}
          <Autocomplete
            value={selectedCondition}
            onChange={handleConditionChange}
            label="Tilstand"
            className="max-w-xs"
            size="sm"
            variant="bordered"
            selectionMode="multiple"
          >
            {CONDITIONS.map((condition) => (
              <AutocompleteItem key={condition} value={condition}>
                {condition}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Country filter dropdown */}
          <Autocomplete
            value={selectedCountry}
            onChange={handleCountryChange}
            label="Land"
            className="max-w-xs"
            size="sm"
            variant="bordered"
            selectionMode="multiple"
          >
            {COUNTRIES.map((country) => (
              <AutocompleteItem key={country} value={country}>
                {country}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* League filter dropdown */}
          <Autocomplete
            value={selectedLeague}
            onChange={handleLeagueChange}
            label="Liga"
            className="max-w-xs"
            size="sm"
            variant="bordered"
            selectionMode="multiple"
          >
            {LEAGUES.map((league) => (
              <AutocompleteItem key={league} value={league}>
                {league}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <Divider style={{ margin: "30px 0 0 0" }} />

        <div className="auctions-grid">
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))
          ) : (
            <p>No auctions match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionsPage;
