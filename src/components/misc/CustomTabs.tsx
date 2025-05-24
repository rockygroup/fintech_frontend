"use client";
import { Button, HStack, ButtonProps, BoxProps } from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";

interface TabItem {
  label: string;
  id: string | number | boolean;
  isDisabled?: boolean;
}

interface CustomTabsProps {
  tabList: TabItem[];
  defaultValue?: TabItem["id"];
  onChange: (tabId: string | number | boolean) => void;
  size?: ButtonProps["size"];
  boxShadow?: BoxProps["boxShadow"];
  w?: BoxProps["w"];
}

const CustomTabs: FC<CustomTabsProps> = ({
  tabList,
  onChange,
  size,
  boxShadow,
  w,
  defaultValue,
}) => {
  const [activeTab, setActiveTab] = useState<string | number | boolean>(
    defaultValue
  );

  useEffect(() => {
    if (!defaultValue && tabList.length > 0) {
      setActiveTab(tabList[0]?.id);
    } else {
      setActiveTab(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      <HStack
        p={size == "xs" ? 1 : 2}
        bgColor={size == "xs" ? "transparent" : "#FFF"}
        w={w || "max-content"}
        rounded={8}
        boxShadow={boxShadow ?? "sm"}
        overflowX={"scroll"}
        justifyContent={"center"}
        className="hide-scrollbar"
        maxW={["full", "auto"]}
      >
        {tabList?.map((item, key) => (
          <Button
            key={key}
            colorScheme="green"
            bgColor={activeTab == item?.id ? "brand.primary" : "transparent"}
            color={activeTab == item?.id ? "#FFF" : "gray.700"}
            _hover={{
              bgColor: activeTab == item?.id ? "brand.hover" : "gray.100",
            }}
            onClick={() => {
              onChange(item?.id);
              setActiveTab(item?.id);
            }}
            size={size ?? "md"}
            isDisabled={item?.isDisabled}
            textTransform={"capitalize"}
          >
            {item?.label}
          </Button>
        ))}
      </HStack>
    </>
  );
};

export default CustomTabs;
