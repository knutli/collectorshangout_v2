import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../AuthContext";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import ProductsGrid from "../../../auction/AuctionListings/products-grid";
import AuctionListItem from "./auction-list-items-profile";

const MineAuksjoner = () => {
  const { user } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const q = query(
          collection(db, "auctions"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const auctionList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuctions(auctionList);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAuctions();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4">
      <ProductsGrid className="grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <AuctionListItem key={auction.id} auction={auction} />
          ))
        ) : (
          <p>No auctions found.</p>
        )}
      </ProductsGrid>
    </div>
  );
};

export default MineAuksjoner;
