import { Avatar } from "@chakra-ui/react";
import React from "react";

export default function Balance(balance: any) {
  return (
    <div>
      {/* {JSON.stringify(balance.balance)} */}
      <Avatar size="sm" src={balance.balance.image} />
      <small>asset: {balance.balance.asset}</small>
      <small>balance: {balance.balance.balance}</small>
    </div>
  );
}
