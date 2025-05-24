"use client";
import React, { FC } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { API_BASE_URL } from "@/lib/utils/constants";

interface PageProps {
  url: string | null;
  active: Boolean;
  label: string;
  onClick: (url: string) => void;
}

const PagButton = (props: any) => {
  const { onClick } = props;
  const activeStyle = {
    bg: "brand.primary",
    _dark: {
      bg: "brand.primary",
    },
    color: "white",
  };
  return (
    <Button
      size={"sm"}
      rounded="md"
      bg="white"
      color="gray.700"
      isDisabled={!Boolean(props?.url)}
      opacity={props.disabled && 0.6}
      _hover={!props.disabled && activeStyle}
      cursor={props.disabled && "not-allowed"}
      {...(props.active && activeStyle)}
      onClick={() => {
        if (props.url) {
          onClick(props?.url?.replace(API_BASE_URL, ""));
        }
      }}
    >
      {props.children}
    </Button>
  );
};

const Pagination = ({ pages, onClick }) => {
  return (
    <>
      <Flex w="full" alignItems="center" justifyContent="flex-end" gap={1}>
        {pages?.map(({ active, url, label }: PageProps, key: number) => (
          <PagButton key={key} active={active} url={url} onClick={onClick}>
            {label?.replace(/&laquo;/g, "")?.replace(/&raquo;/g, "")}
          </PagButton>
        ))}
      </Flex>
    </>
  );
};

export default Pagination;
