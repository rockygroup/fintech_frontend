"use client";
import ManageAdminPermissions from "@/components/dashboard/admin/ManageAdminPermissions";
import ManageMemberPermissions from "@/components/dashboard/admin/ManageMemberPermissions";
import PortalBanks from "@/components/dashboard/main/admin/PortalBanks";
import CustomEditableInput from "@/components/misc/CustomEditableInput";
import CustomTabs from "@/components/misc/CustomTabs";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

interface FormSubheadingProps {
  title: string;
  mt?: BoxProps["mt"];
  mb?: BoxProps["mb"];
}

const page = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [data, setData] = useState<any>([]);
  const [rawData, setRawData] = useState<any>([]);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getSettings();
      getRoles();
    }
  }, []);

  async function handleStatusUpdate(id: string | number, data: object) {
    try {
      await API.adminUpdateService(id, data);
      getSettings();
    } catch (error) {
      handleError({
        title: "Error while upating status",
        error: error,
      });
    }
  }

  async function getSettings() {
    try {
      let services: {
        name: string;
        provider: string;
        status: boolean;
        service_id: number | string;
        limit: string | number
      }[] = [];
      const res = await API.getServices();
      setRawData(res.data);
      if (res.data?.length) {
        res.data?.forEach((item: any) => {
          services.push({
            name: item?.name,
            status: Boolean(item?.active),
            provider: item?.provider,
            service_id: item?.id,
            limit: item?.limit
          });
        });
      }
      setData(services);
      localStorage.setItem("services", JSON.stringify(services));
    } catch (error) {
      handleError({
        title: "Error while getting settings",
        error: error,
      });
    }
  }

  async function getRoles() {
    try {
      const res = await API.adminGetAllRoles();
      setRoles(res.data);
    } catch (error) {
      handleError({
        title: "Error while getting roles",
        error: error,
      });
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Portal Settings
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <VStack w={"full"} gap={6} alignItems={"flex-start"}>
          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Allow Signup</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" && item?.name == "allow_signup"
                )?.status
              }
              name="allow_signup"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" && item?.name == "allow_signup"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Login OTP Required</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" && item?.name == "otp"
                )?.status
              }
              name="otp"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" && item?.name == "otp"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Allow Fund Requests</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" &&
                    item?.name == "allow_fund_request"
                )?.status
              }
              name="allow_fund_request"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" &&
                      item?.name == "allow_fund_request"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Allow Wallet Transfers</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" &&
                    item?.name == "allow_wallet_transfer"
                )?.status
              }
              name="allow_wallet_transfer"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" &&
                      item?.name == "allow_wallet_transfer"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Allow Fund Transfers</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" &&
                    item?.name == "allow_fund_transfer"
                )?.status
              }
              name="allow_fund_transfer"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" &&
                      item?.name == "allow_fund_transfer"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Allow Chat Support</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "portal" &&
                    item?.name == "allow_chat_support"
                )?.status
              }
              name="allow_chat_support"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "portal" &&
                      item?.name == "allow_chat_support"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Max. Fund Request</Text>
            {data?.find(
              (item: any) =>
                item?.provider == "portal" && item?.name == "allow_fund_request"
            )?.service_id ? (
              <CustomEditableInput
                defaultValue={
                  data?.find(
                    (item: any) =>
                      item?.provider == "portal" &&
                      item?.name == "allow_fund_request"
                  )?.limit || 0
                }
                onSubmit={(value) =>
                  handleStatusUpdate(
                    rawData?.find(
                      (item: any) =>
                        item?.provider == "portal" &&
                        item?.name == "allow_fund_request"
                    )?.id,
                    { limit: value }
                  )
                }
              />
            ) : null}
          </HStack>
        </VStack>
      </Box>

      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Fund Request Banks
      </Heading>

      <PortalBanks />

      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Eko Services Settings
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <VStack w={"full"} gap={6} alignItems={"flex-start"}>
          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Eko API Status</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) => item?.provider == "eko" && item?.name == "api"
                )?.status
              }
              name="eko_api"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "eko" && item?.name == "api"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>AePS Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) => item?.provider == "eko" && item?.name == "aeps"
                )?.status
              }
              name="eko_aeps"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "eko" && item?.name == "aeps"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Bill Pay Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) => item?.provider == "eko" && item?.name == "bbps"
                )?.status
              }
              name="eko_bbps"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "eko" && item?.name == "bbps"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>DMT Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) => item?.provider == "eko" && item?.name == "dmt"
                )?.status
              }
              name="eko_dmt"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "eko" && item?.name == "dmt"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Payout Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "eko" && item?.name == "payout"
                )?.status
              }
              name="eko_payout"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "eko" && item?.name == "payout"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>
        </VStack>
      </Box>

      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Paysprint Services Settings
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <VStack w={"full"} gap={6} alignItems={"flex-start"}>
          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Paysprint API Status</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "api"
                )?.status
              }
              name="paysprint_api"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "api"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>AePS Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "aeps"
                )?.status
              }
              name="paysprint_aeps"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "aeps"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Bill Pay Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "bbps"
                )?.status
              }
              name="paysprint_bbps"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "bbps"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>CMS Deposit Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "cms"
                )?.status
              }
              name="paysprint_cms"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "cms"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>DMT Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "dmt"
                )?.status
              }
              name="paysprint_dmt"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "dmt"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Recharge Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "recharge"
                )?.status
              }
              name="paysprint_recharge"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "recharge"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>LIC Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "lic"
                )?.status
              }
              name="paysprint_lic"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "lic"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Fastag Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "fastag"
                )?.status
              }
              name="paysprint_fastag"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "fastag"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>PAN Card Services</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paysprint" && item?.name == "pan"
                )?.status
              }
              name="paysprint_pan"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paysprint" && item?.name == "pan"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>
        </VStack>
      </Box>

      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Other Services Settings
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <VStack w={"full"} gap={6} alignItems={"flex-start"}>
          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Razorpay Payout Status</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "razorpay" && item?.name == "payout"
                )?.status
              }
              name="razorpay_payout"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "razorpay" && item?.name == "payout"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Paydeer Payout Status</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "paydeer" && item?.name == "payout"
                )?.status
              }
              name="paydeer_payout"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "paydeer" && item?.name == "payout"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

          <HStack w={["full", "sm"]} justifyContent={"space-between"}>
            <Text>Waayupay Payout Status</Text>
            <Switch
              isChecked={
                data?.find(
                  (item: any) =>
                    item?.provider == "waayupay" && item?.name == "payout"
                )?.status
              }
              name="waayupay_payout"
              onChange={(e) =>
                handleStatusUpdate(
                  rawData?.find(
                    (item: any) =>
                      item?.provider == "waayupay" && item?.name == "payout"
                  )?.id,
                  { active: e.target.checked }
                )
              }
            />
          </HStack>

        </VStack>
      </Box>

      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Default Admin Permissions
      </Heading>
      <ManageAdminPermissions
        roleId={roles?.filter((role: any) => role?.name == "admin")?.id}
      />

      <br />

      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          Default User Permissions
        </Heading>
        {roles?.length ? (
          <CustomTabs
            tabList={roles
              ?.filter((role: any) => role?.name != "admin")
              ?.map((role: any) => ({
                id: role?.id,
                label: role?.name?.replace(/_/g, " "),
              }))}
            defaultValue={selectedRole}
            onChange={(value) => setSelectedRole(value)}
          />
        ) : null}
      </Stack>
      <ManageMemberPermissions
        roleId={selectedRole}
        isRetailer={
          roles?.find((role: any) => role?.id == selectedRole)?.name ===
          "retailer"
        }
      />
    </>
  );
};

export default page;
