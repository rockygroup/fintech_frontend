"use client";
import PinModal from "@/components/dashboard/misc/PinModal";
import CustomButton from "@/components/misc/CustomButton";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  useDisclosure,
  useStatStyles,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

const page = () => {
  const { handleError } = useErrorHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [beneficiary, setBeneficiary] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [maxAmount, setMaxAmount] = useState("");
  const [availableProviders, setAvailableProviders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const services = JSON.parse(localStorage.getItem("services"));
    if (user) {
      setMaxAmount(user?.wallet);
    }
    if (services) {
      setAvailableProviders(services);
    }
    if (beneficiary?.id) {
      onOpen();
    }
  }, [beneficiary?.id]);

  async function verifyBeneficiary(values: any) {
    try {
      console.log(values);
      if (!values?.amount || !values?.user_id) {
        handleError({
          title: "All fields are required",
          description: "Please enter amount and user phone number",
        });
        return;
      }
      setIsLoading(true);
      setIsLoading(false);
      const res = await API.fetchUserInfo(values?.user_id);
      setFormData({
        ...values,
        service_id: availableProviders?.find(
          (item: any) =>
            item?.provider == "portal" && item?.name == "allow_wallet_transfer"
        )?.id,
        receiver_id: res?.data?.id,
      });
      setBeneficiary(res?.data);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Could not verify beneficiary",
        error: error,
      });
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={4}>
        Wallet Transfer
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            user_id: "",
            user_remarks: "",
            amount: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack direction={["column", "row"]} gap={8} mb={8}>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="user_id"
                    type="text"
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <FormLabel>Beneficiary Phone</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <NumberInput
                    name="amount"
                    onChange={(value) => setFieldValue("amount", value)}
                    min={1}
                    max={Number(maxAmount) || 10000}
                  >
                    <NumberInputField placeholder="₹" />
                    <FormLabel>Amount</FormLabel>
                  </NumberInput>
                </FormControl>
                <FormControl maxW={["full", "lg"]} variant={"floating"}>
                <Input
                    name="user_remarks"
                    type="text"
                    onChange={handleChange}
                    placeholder=" "
                  />
                    <FormLabel>Remarks</FormLabel>
                </FormControl>
              </Stack>
              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                <CustomButton
                  isLoading={isLoading}
                  onClick={() => verifyBeneficiary(values)}
                >
                  Send
                </CustomButton>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <br />
      <br />



      <PinModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setBeneficiary(null);
        }}
        type="wallet-transfer"
        formData={formData}
        title={`Send ₹${formData?.amount} to ${beneficiary?.name}?`}
        description={"Enter your PIN to confirm this transaction"}
      />
    </>
  );
};

export default page;
