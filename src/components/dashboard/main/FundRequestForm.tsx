"use client";
import FileDropzone from "@/components/misc/FileDropzone";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { FormAxios } from "@/lib/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { FC, useState } from "react";
import SelectPortalBank from "../misc/select/SelectPortalBank";

interface FormProps {
  onClose: () => void;
}

const FundRequestForm: FC<FormProps> = ({ onClose }) => {
  const { handleError } = useErrorHandler();
  const Toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: object) {
    setIsLoading(true);
    FormAxios.post("/user/fund-requests", values)
      .then((res) => {
        onClose();
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
      <Formik
        initialValues={{
          amount: "",
          transaction_id: "",
          transaction_date: "",
          requested_bank: "",
          user_remarks: "",
          receipt: null,
          channel: "",
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Stack direction={["column", "row"]} gap={8} mb={8}>
              <FormControl maxW={["full", "xs"]} variant={"floating"}>
                <Input
                  name="amount"
                  type="number"
                  placeholder="₹"
                  onChange={handleChange}
                />
                <FormLabel>Amount</FormLabel>
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
              <Box w={["full"]}>
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
              <Button onClick={onClose}>Cancel</Button>
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
    </>
  );
};

export default FundRequestForm;
