"use client";
import Loader from "@/components/global/Loader";
import CustomButton from "@/components/misc/CustomButton";
import useTransactionHandler from "@/lib/hooks/useTransactionHandler";
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
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Receipt from "../misc/receipt/Receipt";
import useAdminTransactionHandler from "@/lib/hooks/useAdminTransactionHandler";

interface PinInputParams {
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
    | "wallet-transfer"
    | "fund-transfer";
  formData?: object | null;
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  title?: string;
}

const AdminPinModal = ({
  isOpen,
  onClose,
  type,
  formData,
  title,
  description,
}: PinInputParams) => {
  const { processTransaction, isLoading, setPin, receiptData } =
    useTransactionHandler();

  const [receiptStatus, setReceiptStatus] = useState(false);

  useEffect(() => {
    if (isLoading || Boolean(receiptData?.transaction_id)) onClose();
  }, [receiptData, isLoading]);

  useEffect(() => {
    if (receiptData?.transaction_id) {
      console.log("Trying to show receipt");
      console.log(receiptData);
      setReceiptStatus(true);
    }
  }, [receiptData]);

  return (
    <>
      {isLoading ? <Loader text={"Processing transaction..."} /> : null}

      <Hide below="md">
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title || "Enter Your PIN"}</ModalHeader>
            <ModalBody>
              <Text textAlign={"center"}>{description || ""}</Text>
              <HStack w={"full"} justifyContent={"center"} gap={4}>
                <PinInput otp onComplete={(value) => setPin(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <HStack w={"full"} justifyContent={"flex-end"} gap={4}>
                <Button onClick={onClose}>Cancel</Button>
                <CustomButton
                  onClick={() =>
                    processTransaction({ type: type, formData: formData })
                  }
                >
                  Submit
                </CustomButton>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Hide>

      <Hide above="md">
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Enter Your PIN</DrawerHeader>
            <DrawerBody>
              <HStack w={"full"} justifyContent={"center"} gap={4}>
                <PinInput otp onComplete={(value) => setPin(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </DrawerBody>
            <DrawerFooter>
              <HStack w={"full"} justifyContent={"flex-end"} gap={4}>
                <Button onClick={onClose}>Cancel</Button>
                <CustomButton
                  onClick={() =>
                    processTransaction({ type: type, formData: formData })
                  }
                >
                  Submit
                </CustomButton>
              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Hide>

      <Receipt
        isOpen={receiptStatus}
        onClose={() => setReceiptStatus(false)}
        data={{ ...receiptData, hideFooter: true, hideLogo: true }}
      />
    </>
  );
};

export default AdminPinModal;
