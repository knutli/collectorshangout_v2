"use client";

import React, { useContext, useState } from "react";
import { Button, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { AuthContext } from "../../../../AuthContext";

import { sectionItems } from "./sidebar-items"; // Updated sidebar items
import { cn } from "./cn";

import Sidebar from "./sidebar";
import TempHeader from "../../../general/navbar/TempHeader";
import ProfileDisplay from "../profile/profile-enter-info";
import MyAuctions from "../myauctions/my-auctions";
import Billing from "../billing/main-billing";
import ProfileHeader from "../profile/profile-header";

export default function MainSidebar({ isUserLoggedIn }) {
  const { user, isLoading } = useContext(AuthContext);
  const isCompact = useMediaQuery("(max-width: 768px)");
  const [activeKey, setActiveKey] = useState("profil"); // State for active component

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Function to handle sidebar item clicks
  const handleSidebarClick = (key) => {
    setActiveKey(key);
  };

  return (
    <div>
      <TempHeader isUserLoggedIn={isUserLoggedIn} isBlackText={true} />
      <div className="flex h-dvh w-full">
        <div
          className={cn(
            "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
            {
              "w-16 items-center px-2 py-6": isCompact,
            }
          )}
        >
          <div
            className={cn("flex items-center gap-3 px-3", {
              "justify-center gap-0": isCompact,
            })}
          ></div>
          <Spacer y={8} />

          <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
            <Sidebar
              defaultSelectedKey="profil"
              isCompact={isCompact}
              items={sectionItems}
              onSelect={handleSidebarClick} // Handle item clicks
            />
          </ScrollShadow>
          <Spacer y={2} />
          <div
            className={cn("mt-auto flex flex-col", {
              "items-center": isCompact,
            })}
          >
            <Tooltip
              content="Hjelp og informasjon"
              isDisabled={!isCompact}
              placement="right"
            >
              <Button
                fullWidth
                className={cn(
                  "justify-start truncate text-default-500 data-[hover=true]:text-foreground",
                  {
                    "justify-center": isCompact,
                  }
                )}
                isIconOnly={isCompact}
                startContent={
                  isCompact ? null : (
                    <Icon
                      className="flex-none text-default-500"
                      icon="solar:info-circle-line-duotone"
                      width={24}
                    />
                  )
                }
                variant="light"
              >
                {isCompact ? (
                  <Icon
                    className="text-default-500"
                    icon="solar:info-circle-line-duotone"
                    width={24}
                  />
                ) : (
                  "Hjelp og informasjon"
                )}
              </Button>
            </Tooltip>
            <Tooltip
              content="Logg ut"
              isDisabled={!isCompact}
              placement="right"
            >
              <Button
                className={cn(
                  "justify-start text-default-500 data-[hover=true]:text-foreground",
                  {
                    "justify-center": isCompact,
                  }
                )}
                isIconOnly={isCompact}
                startContent={
                  isCompact ? null : (
                    <Icon
                      className="flex-none rotate-180 text-default-500"
                      icon="solar:minus-circle-line-duotone"
                      width={24}
                    />
                  )
                }
                variant="light"
              >
                {isCompact ? (
                  <Icon
                    className="rotate-180 text-default-500"
                    icon="solar:minus-circle-line-duotone"
                    width={24}
                  />
                ) : (
                  "Logg ut"
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="w-full flex-1 flex-col p-4 pt-16">
          <main className="mt-4 h-full w-full overflow-visible">
            {activeKey === "profil" && (
              <div className="flex flex-col h-[90%] w-full gap-4 pl-4 md:pl-12 rounded-medium">
                <div className="w-full p-2 md:p-4">
                  <ProfileHeader />
                </div>
                <div className="w-full p-2 md:p-4">
                  <ProfileDisplay />
                </div>
              </div>
            )}
            {activeKey === "chat" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Chat Component Placeholder{" "}
                {/* Replace with actual Chat component */}
              </div>
            )}
            {activeKey === "mine-auksjoner" && (
              <div className="flex h-[90%] w-full flex-col gap-4 pl-12 rounded-medium  border-divider">
                <MyAuctions />
              </div>
            )}
            {activeKey === "min-samling" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Min Samling Component Placeholder{" "}
                {/* Replace with actual Min Samling component */}
              </div>
            )}
            {activeKey === "aktivitet" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Aktivitet Component Placeholder{" "}
                {/* Replace with actual Aktivitet component */}
              </div>
            )}
            {activeKey === "varslinger" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Varslinger Component Placeholder{" "}
                {/* Replace with actual Varslinger component */}
              </div>
            )}
            {activeKey === "kontaktinformasjon" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Kontaktinformasjon Component Placeholder{" "}
                {/* Replace with actual Kontaktinformasjon component */}
              </div>
            )}
            {activeKey === "betaling" && (
              <div className="flex h-[90%] w-full flex-col pl-24 gap-4 rounded-medium  border-divider">
                <Billing />
              </div>
            )}
            {activeKey === "slett-konto" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Slett Konto Component Placeholder{" "}
                {/* Replace with actual Slett Konto component */}
              </div>
            )}
            {activeKey === "hjelp-informasjon" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Hjelp og Informasjon Component Placeholder{" "}
                {/* Replace with actual Hjelp og Informasjon component */}
              </div>
            )}
            {activeKey === "logg-ut" && (
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                Logg ut Component Placeholder{" "}
                {/* Replace with actual Logg ut component */}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
