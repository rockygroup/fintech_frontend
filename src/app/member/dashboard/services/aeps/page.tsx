"use client";
import AepsWithdrawalForm from "@/components/dashboard/services/aeps/AepsWithdrawalForm";
import CustomTabs from "@/components/misc/CustomTabs";
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
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const ref = useRef(true);

  const [serviceType, setServiceType] = useState("cw");
  const [biometricDevice, setBiometricDevice] = useState("mantra");
  const [provider, setProvider] = useState<string | number | boolean>(
    "paysprint"
  );
  const [availableProviders, setAvailableProviders] = useState<any>([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      const data = JSON.parse(
        localStorage.getItem("services")
      );
      if (data) {
        setAvailableProviders(data);
      }
    }
  }, []);

  return (
    <>
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          AePS Services
        </Heading>

        <CustomTabs
          defaultValue={provider}
          tabList={[
            {
              id: "eko",
              label: "eko",
              isDisabled: !availableProviders?.find(
                (item: any) => item?.provider == "eko" && item?.name == "aeps"
              )?.status,
            },
            {
              id: "paysprint",
              label: "paysprint",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "paysprint" && item?.name == "aeps"
              )?.status,
            },
          ]}
          onChange={(value) => setProvider(value)}
        />
      </Stack>

      <Stack direction={["column", "row"]} mb={8} gap={6}>
        <FormControl maxW={["full", "xs"]}>
          <FormLabel>Select Service</FormLabel>
          <Select
            onChange={(e) => setServiceType(e.target.value)}
            value={serviceType}
            bgColor={"#FFF"}
          >
            <option value="ap">Aadhaar Pay</option>
            <option value="cw">Cash Withdrawal</option>
            <option value="be">Balance Enquiry</option>
            <option value="ms">Mini Statement</option>
          </Select>
        </FormControl>
        {serviceType == "cw" || serviceType == "ap" ? (
          <FormControl maxW={["full", "xs"]}>
            <FormLabel>Select Device</FormLabel>
            <Select
              onChange={(e) => setBiometricDevice(e.target.value)}
              value={biometricDevice}
              bgColor={"#FFF"}
            >
              <option value="mantra">Mantra</option>
            </Select>
          </FormControl>
        ) : null}
      </Stack>

      {serviceType == "cw" ? (
        <AepsWithdrawalForm
          provider={provider}
          biometricDevice={biometricDevice}
          isDisabled={
            provider == "eko"
              ? !availableProviders?.eko_aeps
              : !availableProviders?.paysprint_aeps
          }
        />
      ) : null}
    </>
  );
};

export default page;
