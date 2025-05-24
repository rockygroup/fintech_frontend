"use client";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { FC, useState } from "react";

interface FormProps {
  onClose: () => void;
}

const WalletTransferForm: FC<FormProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  async function onSubmit(values: object) {
    setIsLoading(true);
    try {
      // TODO: Send request to server and handle response.
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          phone_number: "",
          amount: "",
          member_remarks: "",
        }}
        onSubmit={console.log}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Stack direction={["column", "row"]} gap={8} mb={8}>
              <FormControl maxW={["full", "xs"]} variant={"floating"}>
                <Input name="phone_number" type="tel" max={10} placeholder=" " />
                <FormLabel>Beneficiary Phone No.</FormLabel>
              </FormControl>
              <FormControl maxW={["full", "xs"]} variant={"floating"}>
                <NumberInput name="amount" min={1} max={45000}>
                  <NumberInputField placeholder=" " />
                <FormLabel>Amount</FormLabel>
                </NumberInput>
                <Text
                  fontSize={"xs"}
                  color={"gray.700"}
                  px={4}
                  py={1}
                  fontWeight={"medium"}
                >
                  Available Balance: ₹45000
                </Text>
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} gap={8} mb={8}>
              <FormControl maxW={["full"]} variant={"floating"}>
                <Textarea name="member_remarks" resize={"none"} placeholder=" " />
                <FormLabel>Remarks</FormLabel>
              </FormControl>
            </Stack>
            <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                bgColor={"brand.primary"}
                _hover={{
                  bgColor: "brand.hover",
                }}
                color={"#FFF"}
                isLoading={isLoading}
                isDisabled={isDisabled}
                onClick={() => onSubmit(values)}
              >
                Send
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default WalletTransferForm;
