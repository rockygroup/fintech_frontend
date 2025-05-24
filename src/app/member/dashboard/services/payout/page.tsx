"use client";
import PinModal from "@/components/dashboard/misc/PinModal";
import PinDrawer from "@/components/dashboard/misc/PinModal";
import RecentPayouts from "@/components/dashboard/services/payouts/RecentPayouts";
import CustomTabs from "@/components/misc/CustomTabs";
import useTransactionHandler from "@/lib/hooks/useTransactionHandler";
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
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const ref = useRef(true);
  const Toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState<any>(null);
  const [provider, setProvider] = useState<string | number | boolean>(
    "flipzik"
  );
  const [availableProviders, setAvailableProviders] = useState<any>([]);

  const paymentModes = [
    {
      type: "imps",
      eko_code: "5",
    },
    {
      type: "neft",
      eko_code: "4",
    },
    {
      type: "rtgs",
      eko_code: "13",
    },
  ];

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      const data = JSON.parse(localStorage.getItem("services"));
      if (data) {
        setAvailableProviders(data);
      }
    }
  }, []);

  function handleFormSubmit(values: any) {
    if (values?.account_number != values?.account_number_confirmation) {
      Toast({
        description: "Account numbers don't match",
      });
      return;
    }
    setFormData({
      ...values,
      provider: provider,
      service_id: availableProviders?.find(
        (item: any) => item?.provider == provider && item?.name == "payout"
      )?.id,
    });
    onOpen();
  }

  return (
    <>
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          Payout
        </Heading>

        {/* <CustomTabs
          defaultValue={provider}
          tabList={[
            {
              id: "eko",
              label: "eko",
              isDisabled: !availableProviders?.find(
                (item: any) => item?.provider == "eko" && item?.name == "payout"
              )?.status,
            },
            {
              id: "razorpay",
              label: "razorpay",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "razorpay" && item?.name == "payout"
              )?.status,
            },
            {
              id: "waayupay",
              label: "waayupay",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "waayupay" && item?.name == "payout"
              )?.status,
            },
            {
              id: "paydeer",
              label: "paydeer",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "paydeer" && item?.name == "payout"
              )?.status,
            },
            {
              id: "safexpay",
              label: "safexpay",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "safexpay" && item?.name == "payout"
              )?.status,
            },
          ]}
          onChange={(value) => setProvider(value)}
        /> */}
      </Stack>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            beneficiary_name: "",
            account_number: "",
            account_number_confirmation: "",
            ifsc_code: "",
            amount: "",
            provider: provider,
            mode: "imps",
          }}
          onSubmit={console.log}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleReset,
            errors,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Stack
                direction={["column", "row"]}
                spacing={8}
                flexWrap={"wrap"}
                my={4}
              >
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="beneficiary_name"
                    onChange={handleChange}
                    value={values?.beneficiary_name}
                    placeholder=" "
                  />
                  <FormLabel>Beneficiary Name</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="account_number"
                    onChange={handleChange}
                    value={values?.account_number}
                    placeholder=" "
                  />
                  <FormLabel>Account Number</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="account_number_confirmation"
                    onChange={handleChange}
                    value={values?.account_number_confirmation}
                    placeholder=" "
                  />
                  <FormLabel>Confirm Account Number</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="ifsc_code"
                    onChange={handleChange}
                    value={values?.ifsc_code}
                    placeholder=" "
                  />
                  <FormLabel>IFSC</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <NumberInput min={50}>
                    <NumberInputField
                      name="amount"
                      onChange={handleChange}
                      value={values?.amount}
                      placeholder="₹"
                    />
                    <FormLabel>Amount (₹)</FormLabel>
                  </NumberInput>
                </FormControl>

                <Box>
                  <FormLabel>Payment Mode</FormLabel>
                  <RadioGroup
                    value={values?.mode}
                    onChange={(value) => setFieldValue("mode", value)}
                  >
                    <HStack justifyContent={'flex-start'} gap={6}>
                      {paymentModes.map((item, key) => (
                        <Radio
                          value={
                            provider == "eko" ? item?.eko_code : item?.type
                          }
                        >
                          {item?.type?.toUpperCase()}
                        </Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
                </Box>
              </Stack>

              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                <Button
                  bgColor={"brand.primary"}
                  _hover={{
                    bgColor: "brand.hover",
                  }}
                  color={"#FFF"}
                  onClick={() => handleFormSubmit(values)}
                >
                  Submit
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <br />
      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Recent Payouts
      </Heading>
      <RecentPayouts />

      <PinModal
        isOpen={isOpen}
        onClose={onClose}
        type="payout"
        formData={formData}
      />
    </>
  );
};

export default page;
