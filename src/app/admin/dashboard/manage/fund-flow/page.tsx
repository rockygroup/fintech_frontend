"use client";
import AdminPinModal from "@/components/dashboard/admin/AdminPinModal";
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
  Select,
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
  const [maxAmount, setMaxAmount] = useState(1000000);
  const [availableProviders, setAvailableProviders] = useState([]);

  async function verifyBeneficiary(values: any) {
    try {
      console.log(values);
      if (!values?.amount || !values?.user_id ||  !values?.activity_type) {
        handleError({
          title: "All fields are required",
          description: "Please enter amount, trnxn type and user phone number",
        });
        return;
      }
      setIsLoading(true);
      setIsLoading(false);
      const res = await API.fetchUserInfo(values?.user_id);
      setFormData({
        ...values,
        receiver_id: res?.data?.id,
      });
      setBeneficiary(res?.data);
      onOpen()
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
        Fund Flow
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            user_id: "",
            remarks: "",
            amount: "",
            activity: ""
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
                  <FormLabel>User Phone</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <NumberInput
                    name="amount"
                    onChange={(value) => setFieldValue("amount", value)}
                    min={1}
                    max={Number(maxAmount) || 1000000}
                  >
                    <NumberInputField placeholder="₹" />
                    <FormLabel>Amount</FormLabel>
                  </NumberInput>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Select name="activity_type" onChange={handleChange}>
                    <option value="">Transaction Type</option>
                    <option value="transfer">Transfer</option>
                    <option value="reversal">Reversal</option>
                  </Select>
                </FormControl>
              </Stack>
              <FormControl maxW={["full"]} variant={"floating"} mb={4}>
                <Input
                  name="remarks"
                  type="text"
                  onChange={handleChange}
                  placeholder=" "
                />
                <FormLabel>Remarks</FormLabel>
              </FormControl>
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
        onClose={onClose}
        type="fund-transfer"
        formData={formData}
        title={`${formData?.activity_type == "transfer" ? "Credit" : "Debit"} ₹${formData?.amount} ${formData?.activity_type == "transfer" ? "to" : "from"} ${beneficiary?.name}?`}
        description={"Enter your PIN to confirm this transaction"}
      />
    </>
  );
};

export default page;
