"use client";
import CustomButton from "@/components/misc/CustomButton";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import SelectState from "../misc/select/SelectState";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API } from "@/lib/api";

interface BusinessDetailsFormProps {
  userId?: string | number | null;
}

const BusinessDetailsForm = ({ userId }: BusinessDetailsFormProps) => {
  const ref = useRef(true);
  const Toast = useToast();
  const { handleError } = useErrorHandler();

  const [prefilData, setPrefilData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      if (userId) {
        fetchUserAddress();
      } else {
        fetchMyAddress();
      }
    }
  }, []);

  async function handleUpdate(values: any) {
    try {
      setIsLoading(true);
      if (userId) {
        await API.adminUpdateUserAddress(userId, values);
        await fetchUserAddress();
      } else {
        await API.updateUserAddress(values);
        await fetchMyAddress();
      }
      Toast({
        status: "success",
        description: "Address updated successfully!",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Could not update your address",
        error: error,
      });
    }
  }

  async function fetchMyAddress() {
    try {
      setIsLoading(true);
      const res = await API.fetchUserAddress();
      setPrefilData(res?.data[0] || {
        shop_name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Could not fetch your address",
        error: error,
      });
    }
  }

  async function fetchUserAddress() {
    try {
      setIsLoading(true);
      const res = await API.adminFetchUserAddress(userId);
      setPrefilData(
        res?.data[0] || {
          shop_name: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
        }
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Could not fetch user address",
        error: error,
      });
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Update Your Business Details (required for onboarding)
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        {!isLoading && prefilData ? (
          <Formik
            initialValues={{
              shop_name: prefilData?.shop_name,
              street: prefilData?.street,
              city: prefilData?.city,
              state: prefilData?.state,
              pincode: prefilData?.pincode,
            }}
            onSubmit={(values) => handleUpdate(values)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <FormControl w={["full"]} mt={4} mb={8} variant={"floating"}>
                  <Input
                    name="street"
                    onChange={handleChange}
                    value={values?.street}
                    placeholder=" "
                  />
                  <FormLabel>Street Address</FormLabel>
                </FormControl>
                <Stack
                  w={"full"}
                  direction={["column", "row"]}
                  gap={8}
                  mb={8}
                  flexWrap={"wrap"}
                >
                  <FormControl w={["full", "xs"]} variant={"floating"}>
                    <Input
                      name="city"
                      onChange={handleChange}
                      value={values?.city}
                      placeholder=" "
                    />
                    <FormLabel>City</FormLabel>
                  </FormControl>

                  <FormControl w={["full", "xs"]}>
                    <SelectState
                      value={values?.state}
                      onChange={(state) => setFieldValue("state", state)}
                    />
                  </FormControl>

                  <FormControl w={["full", "xs"]} variant={"floating"}>
                    <Input
                      name="pincode"
                      onChange={handleChange}
                      value={values?.pincode}
                      placeholder=" "
                    />
                    <FormLabel>Pincode</FormLabel>
                  </FormControl>

                  <FormControl w={["full", "xs"]} variant={"floating"}>
                    <Input
                      name="shop_name"
                      onChange={handleChange}
                      value={values?.shop_name}
                      placeholder=" "
                    />
                    <FormLabel>Business Name</FormLabel>
                  </FormControl>
                </Stack>

                <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                  <CustomButton isLoading={isLoading} type="submit">
                    Save
                  </CustomButton>
                </HStack>
              </Form>
            )}
          </Formik>
        ) : null}
      </Box>
    </>
  );
};

export default BusinessDetailsForm;
