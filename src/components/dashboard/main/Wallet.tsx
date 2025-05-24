"use client";
import CustomModal from "@/components/misc/CustomModal";
import CustomTabs from "@/components/misc/CustomTabs";
import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { IoWallet } from "react-icons/io5";
import FundRequestForm from "./FundRequestForm";
import WalletTransferForm from "./WalletTransferForm";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API } from "@/lib/api";
import useAuth from "@/lib/hooks/useAuth";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const Wallet = () => {
  const {user} = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleError } = useErrorHandler();
  const ref = useRef(true);

  const [balance, setBalance] = useState<string | number>("");

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getBalance();
    }
  }, []);

  async function getBalance() {
    try {
      const res = await API.wallet();
      setBalance(res?.data?.wallet);
    } catch (error) {
      handleError({
        title: "Error while getting wallet balance",
        error: Error,
      });
    }
  }


  return (
    <>
      <Tooltip label="Click to refresh wallet" hasArrow rounded={4}>
        <HStack
          rounded={"full"}
          bgColor={"#FFF"}
          boxShadow={"md"}
          overflow={"hidden"}
          gap={0}
          cursor={"pointer"}
          onClick={async () => {
            if(user?.roles == "admin"){
              console.log("Admin Wallet")
              await getBalance()
            } else {
              await getBalance()
            }
          }}
        >
          <Box
            boxSize={12}
            bgColor={"brand.primary"}
            display={"grid"}
            placeContent={"center"}
          >
            <Icon as={IoWallet} color={"#FFF"} fontSize={"2xl"} />
          </Box>
          <Box px={2} minW={28}>
            <Text
              fontSize={"xs"}
              fontWeight={"medium"}
              color={"gray.500"}
              lineHeight={1}
            >
              Wallet
            </Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              ₹{Number(balance || 0)?.toLocaleString("en-IN") ?? 0}
            </Text>
          </Box>
        </HStack>
      </Tooltip>

      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [intent, setIntent] = useState<string | number>("request");
  const tabList = [
    {
      id: "request",
      label: "Fund Request",
    },
    {
      id: "transfer",
      label: "Wallet Transfer",
    },
  ];
  return (
    <>
      <CustomModal
        title={intent == "request" ? "New Fund Request" : "Transfer Your Funds"}
        isOpen={isOpen}
        onClose={onClose}
        hideFooter={false}
      >
        <HStack w={"full"} justifyContent={"center"}>
          <CustomTabs
            tabList={tabList}
            onChange={(value) => setIntent(value)}
            boxShadow={"none"}
          />
        </HStack>
        <Box my={8}>
          {intent == "request" ? (
            <FundRequestForm onClose={onClose} />
          ) : (
            <WalletTransferForm onClose={onClose} />
          )}
        </Box>
      </CustomModal>
    </>
  );
};

export default Wallet;
