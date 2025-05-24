"use client";
import CustomButton from "@/components/misc/CustomButton";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

interface ManageAdminPermissionsProps {
  userId?: string;
  roleId?: string | number;
}

const ManageAdminPermissions = ({
  userId,
  roleId,
}: ManageAdminPermissionsProps) => {
  const { handleError } = useErrorHandler();
  const ref = useRef(true);
  const Toast = useToast();

  const [allPermissions, setAllPermissions] = useState([]);
  const [allowedPermissions, setAllowedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (roleId) {
      fetchRolePermissions();
    } else if (userId) {
      fetchUserPermissions();
    }
  }, [userId, roleId]);

  async function fetchData() {
    try {
      const res = await API.adminGetAllPermissions();
      setAllPermissions(
        res.data?.filter((item: any) => item?.name?.includes("admin_"))
      );
    } catch (error) {
      handleError({
        title: "Error while getting permissions",
        error: error,
      });
    }
  }

  async function updatePermissions(data: any) {
    setIsLoading(true);
    try {
      if (userId) {
        await API.adminUpdateUserPermissions(userId, allowedPermissions);
      }
      if (roleId) {
        await API.adminUpdateRolePermissions(roleId, allowedPermissions);
      }
      Toast({
        status: "success",
        description: "Permissions updated successfully!",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Error while updating permissions",
        error: error,
      });
    }
  }

  async function fetchUserPermissions() {
    try {
      const res = await API.adminGetUserPermissions(userId);
      setAllowedPermissions(
        res.data
          ?.filter((item: any) => item?.name?.includes("admin_"))
          ?.map((item: any) => item?.name)
      );
    } catch (error) {
      handleError({
        title: "Error while getting permissions",
        error: error,
      });
    }
  }

  async function fetchRolePermissions() {
    try {
      const res = await API.adminGetRolePermissions(roleId);
      setAllowedPermissions(
        res.data?.filter((item: any) => item?.name?.includes("admin_"))
      );
    } catch (error) {
      handleError({
        title: "Error while getting permissions",
        error: error,
      });
    }
  }

  return (
    <>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            role: "",
            senior: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <CheckboxGroup
                value={allowedPermissions}
                onChange={(values) => setAllowedPermissions(values)}
              >
                <Text fontSize={"sm"} fontWeight={"medium"} mb={4}>
                  ADMIN PANEL PERMISSIONS
                </Text>
                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  User Related Permissions
                </Text>
                <Stack
                  gap={8}
                  mb={8}
                  direction={["row"]}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexWrap={"wrap"}
                >
                  {allPermissions
                    ?.filter(
                      (item: any) =>
                        item?.name?.includes("user") ||
                        item?.name?.includes("credentials")
                    )
                    ?.map((item: any, key) => (
                      <Checkbox
                        key={key}
                        minW={["full", "sm"]}
                        textTransform={"capitalize"}
                        value={item?.name}
                      >
                        {item?.name?.replace("admin_", "")?.replace(/_/g, " ")}
                      </Checkbox>
                    ))}
                </Stack>

                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  Portal Related Permissions
                </Text>
                <Stack
                  gap={8}
                  mb={8}
                  direction={["row"]}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexWrap={"wrap"}
                >
                  {allPermissions
                    ?.filter((item: any) => item?.name?.includes("portal"))
                    ?.map((item: any, key) => (
                      <Checkbox
                        key={key}
                        minW={["full", "sm"]}
                        textTransform={"capitalize"}
                        value={item?.name}
                      >
                        {item?.name?.replace("admin_", "")?.replace(/_/g, " ")}
                      </Checkbox>
                    ))}
                </Stack>

                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  Funds & Transaction Related Permissions
                </Text>
                <Stack
                  gap={8}
                  mb={8}
                  direction={["row"]}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexWrap={"wrap"}
                >
                  {allPermissions
                    ?.filter(
                      (item: any) =>
                        item?.name?.includes("fund") ||
                        item?.name?.includes("transaction")
                    )
                    ?.map((item: any, key) => (
                      <Checkbox
                        key={key}
                        minW={["full", "sm"]}
                        textTransform={"capitalize"}
                        value={item?.name}
                      >
                        {item?.name?.replace("admin_", "")?.replace(/_/g, " ")}
                      </Checkbox>
                    ))}
                </Stack>

                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  Other Permissions
                </Text>
                <Stack
                  gap={8}
                  mb={8}
                  direction={["row"]}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexWrap={"wrap"}
                >
                  {allPermissions
                    ?.filter((item: any) => item?.name?.includes("report"))
                    ?.map((item: any, key) => (
                      <Checkbox
                        key={key}
                        minW={["full", "sm"]}
                        textTransform={"capitalize"}
                        value={item?.name}
                      >
                        {item?.name?.replace("admin_", "")?.replace(/_/g, " ")}
                      </Checkbox>
                    ))}
                </Stack>

                <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                  <CustomButton
                    isLoading={isLoading}
                    onClick={() => updatePermissions(values)}
                  >
                    Save
                  </CustomButton>
                </HStack>
              </CheckboxGroup>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ManageAdminPermissions;
