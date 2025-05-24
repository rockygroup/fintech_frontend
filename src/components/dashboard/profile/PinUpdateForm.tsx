"use client";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import CustomPinInput from "../misc/CustomPinInput";
import { API } from "@/lib/api";

const PinUpdateForm = () => {
  const { handleError } = useErrorHandler();
  const Toast = useToast()

  const [isLoading, setIsLoading] = useState(false);

  async function handlePinChange(values: object) {
    setIsLoading(true);
    await API.changePin(values)
    Toast({
      status: 'success',
      description: 'PIN updated successfully!'
    })
    try {
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      handleError({ title: "Couldn't change your PIN", error: error });
    }
  }
  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Change Your PIN
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            old_credential: "",
            new_credential: "",
            new_credential_confirmation: "",
          }}
          onSubmit={(values) => handlePinChange(values)}
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Stack
                w={"full"}
                direction={["column", "row"]}
                gap={8}
                mb={8}
                mt={4}
              >
                <Box w={["full", "xs"]}>
                  <FormLabel>Old PIN</FormLabel>
                  <CustomPinInput
                    justifyContent={"flex-start"}
                    onComplete={(value) => setFieldValue("old_credential", value)}
                  />
                </Box>

                <Box w={["full", "xs"]}>
                  <FormLabel>New PIN</FormLabel>
                  <CustomPinInput
                    justifyContent={"flex-start"}
                    onComplete={(value) => setFieldValue("new_credential", value)}
                  />
                </Box>

                <Box w={["full", "xs"]}>
                  <FormLabel>Confirm New PIN</FormLabel>
                  <CustomPinInput
                    justifyContent={"flex-start"}
                    onComplete={(value) => setFieldValue("new_credential_confirmation", value)}
                  />
                </Box>
              </Stack>

              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                <Button
                  bgColor={"brand.primary"}
                  _hover={{
                    bgColor: "brand.hover",
                  }}
                  color={"#FFF"}
                  isLoading={isLoading}
                  type="submit"
                >
                  Save
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PinUpdateForm;
