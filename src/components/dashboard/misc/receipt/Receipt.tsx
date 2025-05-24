"use client";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC } from "react";
import Layout1 from "./Layout1";
import { ReceiptProps } from "@/lib/commons/types";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ReceiptProps;
}

const Receipt: FC<ReceiptModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xs"}>
        <ModalOverlay />
        <ModalContent bg={"transparent"} boxShadow={"none"}>
          <ModalBody p={0} boxShadow={"md"}>
            <Layout3
              data={data}
              onClose={() => {
                if (onClose) onClose();
              }}
            />
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"center"}>
              {/* <Button
                onClick={() => console.log("Download")}
                bgColor={"brand.primary"}
                _hover={{
                  bgColor: "brand.hover",
                }}
                size={"xs"}
                rounded={"full"}
                color={"#FFF"}
              >
                Download
              </Button> */}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Receipt;
