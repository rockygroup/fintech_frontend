"use client";
import RecentFundRequests from "@/components/dashboard/main/RecentFundRequests";
import SelectPortalBank from "@/components/dashboard/misc/select/SelectPortalBank";
import FileDropzone from "@/components/misc/FileDropzone";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { FormAxios } from "@/lib/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { FC, useEffect, useState } from "react";

const page = () => {
  const { handleError } = useErrorHandler();
  const Toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [availableProviders, setAvailableProviders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("services"));
    if (data) {
      setAvailableProviders(data);
    }
  }, []);

  async function onSubmit(values: object) {
    setIsLoading(true);
    FormAxios.post("/user/fund-requests", values)
      .then((res) => {
        Toast({
          status: "success",
          description: "Fund request submitted",
        });
      })
      .catch((error) => {
        console.log(error);
        handleError({
          title: "Couldn't post your fund request",
          error: {
            message: error?.response?.data?.message || error?.response?.message,
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(false);
  }

  return (
    <>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Heading as={"h1"} fontSize={"xl"} mb={8}>
          Fund Request
        </Heading>
        <Formik
          initialValues={{
            amount: "",
            transaction_id: "",
            transaction_date: "",
            bank: "",
            user_remarks: "",
            receipt: null,
            channel: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack direction={["column", "row"]} gap={8} mb={8}>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <NumberInput
                    min={10}
                    max={
                      availableProviders?.find(
                        (item: any) =>
                          item?.provider == "portal" &&
                          item?.name == "allow_fund_request"
                      )?.limit || 5000000
                    }
                  >
                    <NumberInputField
                      name="amount"
                      onChange={handleChange}
                      placeholder="₹"
                    />
                    <FormLabel>Amount</FormLabel>
                  </NumberInput>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="transaction_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Transaction ID</FormLabel>
                </FormControl>
              </Stack>
              <Stack direction={["column", "row"]} gap={8} mb={8}>
                <FormControl maxW={["full", "xs"]}>
                  <FormLabel fontSize={"xs"}>Transaction Date</FormLabel>
                  <Input
                    name="transaction_date"
                    type="date"
                    placeholder="Transaction Date"
                    onChange={handleChange}
                  />
                </FormControl>
                <SelectPortalBank name="bank" onChange={handleChange} />
              </Stack>
              <Stack direction={["column", "row"]} gap={8} mb={8}>
                <Box w={["full", "xs"]}>
                  <FileDropzone
                    onUpload={(files) => setFieldValue("receipt", files)}
                    accept="image/*,application/pdf"
                    label="Upload payment receipt"
                    height={32}
                  />
                </Box>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Textarea
                    name="user_remarks"
                    resize={"none"}
                    w={"full"}
                    h={"32"}
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Remarks</FormLabel>
                </FormControl>
              </Stack>
              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                <Button
                  bgColor={"brand.primary"}
                  _hover={{
                    bgColor: "brand.hover",
                  }}
                  color={"#FFF"}
                  isLoading={isLoading}
                  onClick={() => onSubmit(values)}
                >
                  Send
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <Box my={4} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Heading as={"h1"} fontSize={"lg"} mb={8}>
          Recent Fund Requests
        </Heading>

        <RecentFundRequests />
      </Box>
    </>
  );
};

export default page;
