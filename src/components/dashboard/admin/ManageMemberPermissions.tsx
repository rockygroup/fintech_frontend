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

interface ManageMemberPermissionsProps {
  userId?: string;
  isRetailer?: boolean;
  roleId?: string | number;
}

const ManageMemberPermissions = ({
  userId,
  isRetailer,
  roleId,
}: ManageMemberPermissionsProps) => {
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

  async function fetchData() {
    try {
      const res = await API.adminGetAllPermissions();
      setAllPermissions(
        res.data?.filter((item: any) => item?.name?.includes("user_"))
      );
    } catch (error) {
      handleError({
        title: "Error while getting permissions",
        error: error,
      });
    }
  }

  async function fetchUserPermissions() {
    try {
      const res = await API.adminGetUserPermissions(userId);
      setAllowedPermissions(
        res.data?.filter((item: any) => item?.name?.includes("user_"))
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
        res.data
          ?.filter((item: any) => item?.name?.includes("user_"))
          ?.map((item: any) => item?.name)
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
                  MEMBER PANEL PERMISSIONS
                </Text>
                {isRetailer ? null : (
                  <>
                    <br />
                    <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                      Junior User Related Permissions
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
                        ?.filter((item: any) => item?.name?.includes("junior"))
                        ?.map((item: any, key) => (
                          <Checkbox
                            key={key}
                            minW={["full", "sm"]}
                            textTransform={"capitalize"}
                            value={item?.name}
                          >
                            {item?.name
                              ?.replace("user_", "")
                              ?.replace(/_/g, " ")}
                          </Checkbox>
                        ))}
                    </Stack>
                  </>
                )}

                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  Services & Transaction Related Permissions
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
                        (item?.name?.includes("transaction") &&
                          !item?.name?.includes("report")) ||
                        item?.name?.includes("service")
                    )
                    ?.map((item: any, key) => (
                      <Checkbox
                        key={key}
                        minW={["full", "sm"]}
                        textTransform={"capitalize"}
                        value={item?.name}
                      >
                        {item?.name?.replace("user_", "")?.replace(/_/g, " ")}
                      </Checkbox>
                    ))}
                </Stack>

                <br />
                <Text fontSize={"xs"} color={"gray.600"} mb={6}>
                  Reports Related Permissions
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
                        {item?.name?.replace("user_", "")?.replace(/_/g, " ")}
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

export default ManageMemberPermissions;
