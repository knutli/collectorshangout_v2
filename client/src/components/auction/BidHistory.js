import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  User,
} from "@nextui-org/react";
import { parseISO, format } from "date-fns";
import { nb } from "date-fns/locale";

const BidHistory = ({ bidHistory }) => {
  // State to keep track of how many bids to show
  const [visibleCount, setVisibleCount] = useState(5);

  // Function to load more bids
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  // Slice the bid history to only include the number of bids we want to show
  const visibleBids = [...bidHistory].reverse().slice(0, visibleCount);

  return (
    <>
      <Table
        aria-label="Bid History Table"
        color="primary"
        className="bidHistoryTable"
      >
        <TableHeader>
          <TableColumn>Beløp</TableColumn>
          <TableColumn>Budgiver-ID</TableColumn>
          <TableColumn>Tidspunkt</TableColumn>
        </TableHeader>
        <TableBody>
          {visibleBids.map((bid, index) => {
            let formattedDate = "";
            if (bid.bidTimestamp) {
              const date = parseISO(bid.bidTimestamp);
              formattedDate = format(date, "do MMM HH:mm", { locale: nb });
            }

            return (
              <TableRow key={index}>
                <TableCell>NOK {bid.bidAmount}</TableCell>
                <TableCell>
                  <User
                    name={bid.bidderName}
                    avatarProps={{
                      src: bid.bidderPhotoURL || "default-avatar-url",
                      radius: `sm`,
                      isBordered: `true`,
                      size: `sm`,
                    }}
                  />{" "}
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {visibleCount < bidHistory.length && (
        <div style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
          <Button onClick={loadMore}>Vis mer</Button>
        </div>
      )}
    </>
  );
};

export default BidHistory;
