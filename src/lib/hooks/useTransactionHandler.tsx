"use client";
import CustomButton from "@/components/misc/CustomButton";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Hide,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { API } from "../api";
import useErrorHandler from "./useErrorHandler";
import Receipt from "@/components/dashboard/misc/receipt/Receipt";
import Loader from "@/components/global/Loader";
import { ReceiptProps } from "../commons/types";
import { DefaultAxios } from "../utils/axios";

interface TransactionHandlerParams {
  type:
    | "payout"
    | "cw"
    | "ms"
    | "be"
    | "bbps"
    | "cms"
    | "dmt"
    | "lic"
    | "matm"
    | "fund-transfer"
    | "wallet-transfer";
  formData?: object | null;
}

const useTransactionHandler = () => {
  const { handleError } = useErrorHandler();

  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [receiptData, setReceiptData] = useState<ReceiptProps>();

  async function processTransaction({
    type,
    formData,
  }: TransactionHandlerParams) {
    setIsLoading(true);
    if (type == "payout") {
      try {
        let bankName = "";
        await DefaultAxios.get(
          `https://ifsc.razorpay.com/${formData?.ifsc_code}`
        )
          .then((res) => {
            bankName = res?.data["BANK"];
          })
          .catch((err) => {
            handleError({
              title: "Invalid IFSC",
              description: "The provided IFSC is invalid",
            });
            // throw new Error("Please enter a valid IFSC");
          });
        const res = await API.doPayout({
          ...formData,
          pin: pin,
          bank_name: bankName,
        });
        setIsLoading(false);
        setReceiptData({
          type: "payout",
          amount: res?.data?.amount,
          status: res?.data?.status,
          transaction_id: res?.data?.reference_id,
          timestamp: res?.data?.created_at,
          miscData: {
            account_no: res?.data?.account_number,
            beneficiary_name: res?.data?.beneficiary_name,
            IFSC: res?.data?.ifsc_code,
            UTR: res?.data?.utr,
          },
        });
      } catch (error) {
        setIsLoading(false);
        handleError({
          title: "Error while processing payout",
          error: error,
        });
      }
    }
    if (type == "wallet-transfer") {
      try {
        const res = await API.doWalletTransfer({ ...formData, pin: pin });
        setIsLoading(false);
        setReceiptData({
          type: "wallet-transfer",
          amount: res?.data?.amount,
          status: res?.data?.status,
          transaction_id: res?.data?.reference_id,
          timestamp: res?.data?.created_at,
        });
      } catch (error) {
        setIsLoading(false);
        handleError({
          title: "Error while transferring amount",
          error: error,
        });
      }
    }
    if (type == "fund-transfer") {
      try {
        const res = await API.adminDoFundTransfer({ ...formData, pin: pin });
        setIsLoading(false);
        setReceiptData({
          type: "fund-transfer",
          amount: res?.data?.amount,
          status: res?.data?.status,
          transaction_id: res?.data?.reference_id,
          timestamp: res?.data?.created_at,
        });
      } catch (error) {
        setIsLoading(false);
        handleError({
          title: "Error while transferring amount",
          error: error,
        });
      }
    }
  }
  return {
    processTransaction,
    isLoading,
    receiptData,
    setPin,
    setReceiptData,
  };
};

export default useTransactionHandler;
