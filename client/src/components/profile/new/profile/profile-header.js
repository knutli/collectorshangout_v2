"use client";

import React, { useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Tabs,
  Tab,
  Chip,
} from "@nextui-org/react";
import { AuthContext } from "../../../../AuthContext";
import { Icon } from "@iconify/react";

export default function Component() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="flex h-full  w-full items-start justify-left">
      <Card className="my-10 w-[575px]">
        <CardHeader className="relative flex h-[100px] flex-col justify-end overflow-visible bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
          <Avatar className="h-20 w-20 translate-y-12" src={user.photoURL} />
        </CardHeader>
        <CardBody>
          <div className="pb-4 pt-6">
            <p className="text-large font-medium">
              {user.firstName} "{user.username}" {user.lastName}
            </p>
            <p className="max-w-[90%] text-small text-default-400">
              <div>{user.title}</div>
              <div>{user.city}</div>
            </p>
            <div className="flex gap-2 pb-1 pt-2">
              <Chip variant="dot" color="success">
                Online
              </Chip>
              <Chip
                variant="flat"
                startContent={
                  <Icon
                    className="text-default-500"
                    icon="eos-icons:admin-outlined"
                    width={24}
                  />
                }
              >
                Admin
              </Chip>
              <Chip variant="flat">Superselger</Chip>
              <Chip variant="flat">Co-owner</Chip>
            </div>
            <p className="py-2 text-small text-foreground">{user.bio}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
