"use client";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import CustomPinInput from "../misc/CustomPinInput";
import { API } from "@/lib/api";

const PasswordUpdateForm = () => {
  const { handleError } = useErrorHandler();
  const Toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordChange(values: object) {
    setIsLoading(true);
    try {
      await API.changePassword(values);
      Toast({
        status: "success",
        description: "Password updated successfully!",
      });
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      handleError({ title: "Couldn't change your password", error: error });
    }
  }
  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Change Your Password
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            old_credential: "",
            new_credential: "",
            new_credential_confirmation: "",
          }}
          onSubmit={(values) => handlePasswordChange(values)}
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
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    type="password"
                    name="old_credential"
                    onChange={handleChange}
                    value={values?.old_credential}
                    placeholder=" "
                  />
                  <FormLabel>Old Password</FormLabel>
                </FormControl>

                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    type="password"
                    name="new_credential"
                    onChange={handleChange}
                    value={values?.new_credential}
                    placeholder=" "
                  />
                  <FormLabel>New Password</FormLabel>
                </FormControl>

                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="new_credential_confirmation"
                    onChange={handleChange}
                    value={values?.new_credential_confirmation}
                    placeholder=" "
                  />
                  <FormLabel>Confirm New Password</FormLabel>
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

export default PasswordUpdateForm;
