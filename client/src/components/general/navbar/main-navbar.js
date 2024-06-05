"use client";

import React, { useContext } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  Badge,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../../../AuthContext";
import NotificationsCard from "./notifications-card";

export default function Component() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <Navbar
      classNames={{
        base: "lg:bg-transparent lg:backdrop-filter-none",
        item: "data-[active=true]:text-primary",
        wrapper: "px-4 sm:px-6",
      }}
      height="60px"
    >
      <NavbarContent
        className="ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full bg-content2 px-4 dark:bg-content1 sm:flex"
        justify="start"
      >
        <NavbarItem>
          <Link className="flex gap-2 text-inherit" href="/">
            Hjem
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="flex gap-2 text-inherit" href="/auctions">
            Auksjoner
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="flex gap-2 text-inherit" href="/content">
            Blogg
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent
        className="ml-auto flex h-12 max-w-fit items-center gap-0 rounded-full p-0 lg:bg-content2 lg:px-1 lg:dark:bg-content1"
        justify="end"
      >
        <NavbarItem className="flex">
          <Popover offset={12} placement="bottom-end">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
              >
                <Badge color="danger" content="5" showOutline={false} size="md">
                  <Icon
                    className="text-default-500"
                    icon="solar:bell-linear"
                    width={22}
                  />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard className="w-full shadow-none" />
            </PopoverContent>
          </Popover>
        </NavbarItem>
        {user ? (
          <NavbarItem className="px-2">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="mt-1 h-8 w-8 outline-none transition-transform">
                  <Badge
                    className="border-transparent"
                    color="success"
                    content=""
                    placement="bottom-right"
                    shape="circle"
                    size="sm"
                  >
                    <Avatar size="sm" src={user.photoURL} />
                  </Badge>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Innlogget som</p>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                </DropdownItem>
                <DropdownItem key="createauction" as={Link} to="/auctioncreate">
                  Opprett auksjon
                </DropdownItem>
                <DropdownItem key="profile" as={Link} to="/profile">
                  Profil
                </DropdownItem>
                <DropdownItem key="settings" as={Link} to="/settings">
                  Innstillinger
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={signOut}>
                  Logg ut
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link className="flex gap-2 text-inherit" href="/login">
              Logg inn
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="/">
            Hjem
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="/auctions">
            Auksjoner
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="/content">
            Blogg
          </Link>
        </NavbarMenuItem>
        {user ? (
          <>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/auctioncreate">
                Opprett auksjon
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="w-full" color="foreground" href="/profile">
                Profil
              </Link>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="/login">
              Logg inn
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
