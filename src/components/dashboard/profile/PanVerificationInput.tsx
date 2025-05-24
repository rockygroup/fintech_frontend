"use client";
import CustomButton from "@/components/misc/CustomButton";
import CustomModal from "@/components/misc/CustomModal";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface PanVerificationInputProps {
  onSuccess?: (data: any) => void;
  value?: string;
}

const PanVerificationInput = ({
  onSuccess,
  value,
}: PanVerificationInputProps) => {
  const Toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [panNumber, setPanNumber] = useState("");
  const [panHolder, setPanHolder] = useState<any>(null);
  const { handleError } = useErrorHandler();

  function isValidPanCardNumber(panNumber: string) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    return panRegex.test(panNumber);
  }

  async function verify() {
    try {
      if (!isValidPanCardNumber(panNumber))
        throw new Error("Invalid PAN number");
      const res = await API.verifyPanNumber(panNumber);
      setPanHolder(res?.data);
    } catch (error) {
      handleError({
        title: "Error while verifying PAN details",
        error: error,
      });
    }
  }

  async function save() {
    try {
      if (!isValidPanCardNumber(panNumber))
        throw new Error("Invalid PAN number");
      const res = await API.savePanNumber(panNumber);
      Toast({
        status: "success",
        description: "Your PAN was saved successfully",
      });
      if (onSuccess) {
        onSuccess(panNumber);
      }
      onClose();
    } catch (error) {
      handleError({
        title: "Error while saving PAN details",
        error: error,
      });
    }
  }

  return (
    <>
      <FormControl w={["full", "xs"]}>
        <Input
          value={value}
          isDisabled={Boolean(value)}
          isReadOnly={true}
          onClick={() => {
            if (value) {
              Toast({
                title: "Pan Number already verified.",
                description: "Please contact admin if you want to change it",
              });
            } else onOpen();
          }}
          cursor={"pointer"}
          placeholder="Click to verify PAN"
        />
      </FormControl>

      <CustomModal
        title={"Verify PAN Number"}
        isOpen={isOpen}
        onClose={onClose}
        hideFooter={true}
      >
        <Box>
          <Input
            placeholder="Enter your PAN number"
            onChange={(e) => setPanNumber(e.target.value)}
            value={panNumber}
            isDisabled={Boolean(panHolder?.last_name || panHolder?.first_name)}
          />
          <br />
          {panHolder ? (
            <Text>
              Pan Holder - {panHolder?.first_name} {panHolder?.middle_name}{" "}
              {panHolder?.last_name}
            </Text>
          ) : null}
          <br />
          <HStack justifyContent={"flex-end"}>
            <CustomButton onClick={save}>Save</CustomButton>
          </HStack>
        </Box>
      </CustomModal>
    </>
  );
};

export default PanVerificationInput;
