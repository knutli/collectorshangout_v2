"use client";

import React, { useState, useCallback } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  RadioGroup,
  ScrollShadow,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";
import { FilterTypeEnum } from "./filters-types";

import ColorRadioItem from "./color-radio-item";
import PriceSlider from "./price-slider";
import RatingRadioGroup from "./rating-radio-group";
import TagGroupItem from "./tag-group-item";

const FiltersWrapper = React.forwardRef(
  (
    {
      items,
      title = "Filter",
      showTitle = true,
      showActions = true,
      className,
      scrollShadowClassName,
      onPriceRangeChange,
      onSizeChange,
      onColorChange,
      onSortChange, // Add this line
    },
    ref
  ) => {
    const [priceRange, setPriceRange] = React.useState([0, 10000]); // Initial price range state
    const [selectedSizes, setSelectedSizes] = useState([]); // Initial selected sizes state
    const [selectedColors, setSelectedColors] = useState([]);

    const handleSizeChange = useCallback(
      (size) => {
        setSelectedSizes((prevSizes) => {
          const newSizes = prevSizes.includes(size)
            ? prevSizes.filter((s) => s !== size)
            : [...prevSizes, size];
          onSizeChange(newSizes); // Pass the new sizes to the parent component
          return newSizes;
        });
      },
      [onSizeChange]
    );

    const handlePriceRangeChange = useCallback((newRange) => {
      setPriceRange(newRange);
    }, []);

    const handlePriceRangeChangeEnd = useCallback(
      (newRange) => {
        onPriceRangeChange(newRange);
      },
      [onPriceRangeChange]
    );

    const handleColorChange = useCallback(
      (color) => {
        setSelectedColors((prevColors) => {
          const newColors = prevColors.includes(color)
            ? prevColors.filter((c) => c !== color)
            : [...prevColors, color];
          onColorChange(newColors); // Pass the new colors to the parent component
          return newColors;
        });
      },
      [onColorChange]
    );

    const renderFilter = React.useCallback(
      (filter) => {
        switch (filter.type) {
          case FilterTypeEnum.Tabs:
            return (
              <Tabs fullWidth aria-label={filter.title}>
                {filter.options?.map((option) => (
                  <Tab key={option.value} title={option.title} />
                ))}
              </Tabs>
            );

          case FilterTypeEnum.PriceRange:
            return (
              <PriceSlider
                aria-label={filter.title}
                range={{
                  min: 0,
                  max: 10000,
                  defaultValue: [0, 1000],
                  step: 50,
                }}
                value={priceRange}
                onChange={handlePriceRangeChange}
                onChangeEnd={handlePriceRangeChangeEnd}
              />
            );

          case FilterTypeEnum.Rating:
            return <RatingRadioGroup />;

          case FilterTypeEnum.TagGroup:
            return (
              <CheckboxGroup
                aria-label="Select amenities"
                className="gap-1"
                orientation="horizontal"
              >
                {filter.options?.map((option) => (
                  <TagGroupItem
                    key={option.value}
                    size="md"
                    icon={option.icon}
                    value={option.value}
                    isSelected={selectedSizes.includes(option.value)}
                    onClick={() => handleSizeChange(option.value)}
                  >
                    {option.title}
                  </TagGroupItem>
                ))}
              </CheckboxGroup>
            );

          case FilterTypeEnum.Toggle:
            return (
              <div className="-mx-4 flex flex-col">
                {filter.options?.map((option) => (
                  <Switch
                    key={option.value}
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 -mr-2 px-4 py-3"
                      ),
                      wrapper: "mr-0",
                    }}
                    value={option.value}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-medium">{option.title}</p>
                      <p className="text-tiny text-default-400">
                        {option.description}
                      </p>
                    </div>
                  </Switch>
                ))}
              </div>
            );

          case FilterTypeEnum.CheckboxGroup:
            return (
              <Accordion
                className="px-0"
                defaultExpandedKeys={filter?.defaultOpen ? ["options"] : []}
              >
                <AccordionItem
                  key="options"
                  classNames={{
                    title: "text-medium font-medium leading-8 text-default-600",
                    trigger: "p-0",
                    content: "px-1",
                  }}
                  title={filter.title}
                >
                  <CheckboxGroup aria-label={filter.title}>
                    {filter.options?.map((option) => (
                      <Checkbox key={option.value} value={option.value}>
                        {option.title}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </AccordionItem>
              </Accordion>
            );

          case FilterTypeEnum.Color:
            return (
              <RadioGroup
                aria-label={filter.title}
                classNames={{
                  wrapper: "gap-2",
                }}
                orientation="horizontal"
              >
                {filter.options?.map((option) => (
                  <ColorRadioItem
                    key={option.value}
                    color={option.color}
                    tooltip={option.title}
                    isSelected={selectedColors.includes(option.value)}
                    onClick={() => handleColorChange(option.value)}
                  />
                ))}
              </RadioGroup>
            );
          default:
            return null;
        }
      },
      [
        priceRange,
        handlePriceRangeChange,
        handlePriceRangeChangeEnd,
        selectedSizes,
        handleSizeChange,
        selectedColors,
        handleColorChange,
      ]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "h-full max-h-fit w-full max-w-sm rounded-medium bg-content1 p-6",
          className
        )}
      >
        {showTitle && (
          <>
            <h2 className="text-large font-medium text-foreground">{title}</h2>
            <Divider className="my-3 bg-default-100" />
          </>
        )}

        <ScrollShadow
          className={cn(
            "-mx-6 h-full px-6",
            {
              "max-h-[calc(100%_-_220px)]": showActions,
            },
            scrollShadowClassName
          )}
        >
          <div className="flex flex-col gap-6">
            {items.map((filter) => (
              <div key={filter.title} className="flex flex-col gap-3">
                {filter.type !== FilterTypeEnum.CheckboxGroup ? (
                  <div>
                    <h3 className="text-medium font-medium leading-8 text-default-600">
                      {filter.title}
                    </h3>
                    <p className="text-small text-default-400">
                      {filter.description}
                    </p>
                  </div>
                ) : null}
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        </ScrollShadow>

        {showActions && (
          <>
            <Divider className="my-6 bg-default-100" />

            <div className="mt-auto flex flex-col gap-2">
              <Button
                color="primary"
                startContent={
                  <Icon
                    className="text-primary-foreground [&>g]:stroke-[3px]"
                    icon="solar:magnifer-linear"
                    width={16}
                  />
                }
              >
                Vis resultater
              </Button>
              <Button className="text-default-500" variant="flat">
                Fjern alle filtre
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
);

FiltersWrapper.displayName = "FiltersWrapper";

export default FiltersWrapper;
