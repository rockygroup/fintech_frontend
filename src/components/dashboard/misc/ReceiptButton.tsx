"use client";
import { ButtonProps, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { FC } from "react";
import { IoReceipt } from "react-icons/io5";
import Receipt from "./receipt/Receipt";
import { ReceiptProps } from "@/lib/commons/types";

interface ReceiptButtonProps {
  size?: ButtonProps["size"];
  data?: ReceiptProps | undefined;
}

const ReceiptButton: FC<ReceiptButtonProps> = ({ size, data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        aria-label="receipt"
        size={size || "xs"}
        rounded={"full"}
        icon={<IoReceipt />}
        colorScheme="whatsapp"
        onClick={onOpen}
      />

      <Receipt
        isOpen={isOpen}
        onClose={onClose}
        data={{ ...data, hideFooter: true, hideLogo: true }}
      />
    </>
  );
};

export default ReceiptButton;
