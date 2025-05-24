"use client";
import { Text } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useState } from "react";

interface TransactionBadgeProps {
  children: string;
}

const TransactionBadge: FC<TransactionBadgeProps> = ({ children }) => {
  const [bgColor, setBgColor] = useState("#ED7B7B");

  useEffect(() => {
    if (children?.toLowerCase()?.includes("aeps")) setBgColor("yellow.500");
    if (
      children?.toLowerCase()?.includes("bbps") ||
      children?.toLowerCase()?.includes("bill")
    )
      setBgColor("#3C3633");
    if (children?.toLowerCase()?.includes("cms")) setBgColor("blue.500");
    if (children?.toLowerCase()?.includes("dmt")) setBgColor("pink.500");
    if (children?.toLowerCase()?.includes("payout")) setBgColor("twitter.500");
    if (children?.toLowerCase()?.includes("recharge")) setBgColor("#40679E");
    if (children?.toLowerCase()?.includes("fund_request")) setBgColor("whatsapp.500");
    if (children?.toLowerCase()?.includes("fund_transfer"))
      setBgColor("orange.500");
    if (children?.toLowerCase()?.includes("wallet_transfer"))
      setBgColor("facebook.500");
  }, [children]);

  return (
    <>
      <Text
        fontSize={"10px"}
        px={3}
        py={"2px"}
        rounded={4}
        color={"#FFF"}
        bgColor={bgColor}
        fontWeight={"medium"}
      >
        {children?.replace(/-/g, " ")?.replace(/_/g, " ")?.toUpperCase()}
      </Text>
    </>
  );
};

export default TransactionBadge;
