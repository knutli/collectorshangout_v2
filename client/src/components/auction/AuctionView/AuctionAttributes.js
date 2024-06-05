import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const AuctionAttributes = ({ attributes }) => {
  // Map your attributes to a format suitable for the table
  const attributeRows = [
    { label: "Lag", value: attributes.team },
    { label: "Spiller", value: attributes.player },
    { label: "Størrelse", value: attributes.size },
    { label: "Tilstand", value: attributes.condition },
    { label: "Land", value: attributes.leagueCountry },
    { label: "Sesong", value: attributes.seasonAge },
  ];

  return (
    <Table
      aria-label="Auction Attributes Table"
      color="primary" // You can change the color as per your preference
      hideHeader
      isStriped
    >
      <TableHeader>
        <TableColumn>Egenskap</TableColumn>
        <TableColumn>Verdi</TableColumn>
      </TableHeader>
      <TableBody>
        {attributeRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.label}</TableCell>
            <TableCell>{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuctionAttributes;
