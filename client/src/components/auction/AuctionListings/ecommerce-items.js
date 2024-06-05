import { FilterTypeEnum } from "./filters-types";

const ecommerceItems = [
  {
    type: FilterTypeEnum.PriceRange,
    title: "Pris",
    range: {
      min: 0,
      defaultValue: [100, 500],
      max: 2000,
      step: 1,
    },
  },
  {
    type: FilterTypeEnum.TagGroup,
    title: "Størrelse",
    options: [
      {
        title: "XS",
        value: "XS",
      },
      {
        title: "Small",
        value: "S",
      },
      {
        title: "Medium",
        value: "M",
      },
      {
        title: "Large",
        value: "L",
      },
      {
        title: "XL",
        value: "XL",
      },
      {
        title: "XXL",
        value: "XXL",
      },
      {
        title: "3XL",
        value: "3XL",
      },
    ],
  },
  {
    type: FilterTypeEnum.Color,
    title: "Farge",
    options: [
      {
        title: "Black",
        value: "black",
        color: "#000000",
      },
      {
        title: "White",
        value: "white",
        color: "#ffffff",
      },
      {
        title: "Gray",
        value: "gray",
        color: "#3F3F46",
      },
      {
        title: "Red",
        value: "red",
        color: "#F31260",
      },
      {
        title: "Blue",
        value: "blue",
        color: "#006FEE",
      },
      {
        title: "Green",
        value: "green",
        color: "#17C964",
      },
      {
        title: "Yellow",
        value: "yellow",
        color: "#F5A524",
      },
    ],
  },
  {
    type: FilterTypeEnum.CheckboxGroup,
    title: "Kategori",
    options: [
      {
        title: "Sneakers",
        value: "sneakers",
      },
      {
        title: "Boots",
        value: "boots",
      },
      {
        title: "Sandals",
        value: "sandals",
      },
      {
        title: "Slippers",
        value: "slippers",
      },
      {
        title: "Basketball",
        value: "basketball",
      },
      {
        title: "Running",
        value: "running",
      },
      {
        title: "Football",
        value: "football",
      },
      {
        title: "Paddle",
        value: "paddle",
      },
      {
        title: "Tennis",
        value: "tennis",
      },
      {
        title: "Golf",
        value: "golf",
      },
    ],
  },
  {
    type: FilterTypeEnum.CheckboxGroup,
    title: "Gender",
    defaultOpen: true,
    options: [
      {
        title: "Women",
        value: "women",
      },
      {
        title: "Men",
        value: "men",
      },
      {
        title: "Kids",
        value: "kids",
      },
      {
        title: "Unisex",
        value: "unisex",
      },
    ],
  },
  {
    type: FilterTypeEnum.CheckboxGroup,
    title: "Merke",
    defaultOpen: true,
    options: [
      {
        title: "Nike",
        value: "nike",
      },
      {
        title: "Adidas",
        value: "adidas",
      },
      {
        title: "Puma",
        value: "puma",
      },
      {
        title: "Reebok",
        value: "reebok",
      },
      {
        title: "Vans",
        value: "vans",
      },
      {
        title: "New Balance",
        value: "new_balance",
      },
      {
        title: "Converse",
        value: "converse",
      },
      {
        title: "Asics",
        value: "asics",
      },
      {
        title: "Under Armour",
        value: "under_armour",
      },
      {
        title: "Jordan",
        value: "jordan",
      },
    ],
  },
];

export default ecommerceItems;
