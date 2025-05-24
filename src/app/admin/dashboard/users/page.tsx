"use client";
import ExportButtons from "@/components/dashboard/misc/ExportButtons";
import ReceiptButton from "@/components/dashboard/misc/ReceiptButton";
import SelectPlan from "@/components/dashboard/misc/select/SelectPlan";
import CustomButton from "@/components/misc/CustomButton";
import CustomModal from "@/components/misc/CustomModal";
import CustomTabs from "@/components/misc/CustomTabs";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useApiHandler from "@/lib/hooks/useApiHandler";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API_BASE_URL } from "@/lib/utils/constants";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

const page = () => {
  const { handleError } = useErrorHandler();
  const { adminDownloadMedia } = useApiHandler();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(true);
  const Toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("retailer");

  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState([]);

  const [updateUserId, setUpdateUserId] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData({});
    }
  }, [role]);

  useEffect(() => {
    if (url) {
      fetchData({});
    }
  }, [url]);

  async function fetchData(values: any) {
    setIsLoading(true);
    try {
      const res = await API.adminGetUsers({ role: role, ...values }, url);
      setData(res?.data);
      setPages(res?.meta?.links);
      setIsLoading(false);
    } catch (error) {
      handleError({ title: "Error while fetching transactions", error: error });
      setIsLoading(false);
    }
  }

  async function sendPassword(id: string) {
    try {
      Toast({
        description: "Please wait, sending new Password to user.",
      });
      await API.adminSendCredentials(id, {
        credential_type: "password",
        channel: "email",
      });
      Toast({
        status: "success",
        description: "Password was successfully sent to the user!",
      });
    } catch (error) {
      handleError({ title: "Error while sending password", error: error });
    }
  }

  async function sendPin(id: string) {
    try {
      Toast({
        description: "Please wait, sending new PIN to user.",
      });
      await API.adminSendCredentials(id, {
        credential_type: "pin",
        channel: "email",
      });
      Toast({
        status: "success",
        description: "PIN was successfully sent to the user!",
      });
    } catch (error) {
      handleError({ title: "Error while sending PIN", error: error });
    }
  }

  async function blockUser(id: string) {
    try {
      await API.adminBlockUser(id);
      await fetchData({});
      Toast({
        status: "success",
        description: "User was blocked successfully!",
      });
    } catch (error) {
      handleError({ title: "Error while blocking user", error: error });
    }
  }

  async function unblockUser(id: string) {
    try {
      await API.adminUnblockUser(id);
      await fetchData({});
      Toast({
        status: "success",
        description: "User was un-blocked successfully!",
      });
    } catch (error) {
      handleError({ title: "Error while un-blocking user", error: error });
    }
  }

  async function updateUser(id: string, values: object) {
    try {
      await API.adminUpdateUser(id, values);
      await fetchData({});
      Toast({
        status: "success",
        description: "User was updated successfully!",
      });
    } catch (error) {
      handleError({ title: "Error while updating user", error: error });
    }
  }

  async function addRemarks() {
    try {
      await API.adminUpdateUser(updateUserId, { admin_remarks: remarks });
      onClose();
      fetchData({});
      Toast({
        status: "success",
        description: "Remarks were added successfully",
      });
    } catch (error) {
      handleError({ title: "Error while updating user", error: error });
    }
  }

  return (
    <>
      <Stack direction={["column", "row"]} alignItems={"center"} mb={8}>
        <HStack gap={4}>
          <Heading as={"h1"} fontSize={"xl"}>
            Users List
          </Heading>

          {
          // @ts-ignore
          process.env.DISABLE_USER_CREATION === true ? null : (
            <Link
            // href="/admin/dashboard/users/create">
            href="#">
              {/* <CustomButton size={"sm"} rounded={"full"} leftIcon={<FaPlus />}>
                Create New
              </CustomButton> */}
            </Link>
          )}
        </HStack>
        <Spacer />
        <CustomTabs
          tabList={[
            {
              id: "retailer",
              label: "retailer",
            },
            {
              id: "distributor",
              label: "distributor",
            },
            {
              id: "admin",
              label: "admin",
            },
          ]}
          onChange={(value) => {
            ref.current = true;
            // @ts-ignore
            setRole(value);
          }}
          size={"sm"}
        />
      </Stack>
      <br />

      <Box p={6} bgColor={"#FFF"} rounded={4} boxShadow={"base"} mb={8}>
        <Formik
          initialValues={{
            search: "",
            commission_package: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, handleReset, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack
                direction={["column", "row"]}
                spacing={8}
                flexWrap={"wrap"}
                my={4}
              >
                <FormControl maxW={["full", "xs"]}>
                  <FormLabel>Wallet ID / Name / Email / Phone</FormLabel>
                  <Input
                    name="search"
                    onChange={handleChange}
                    value={values?.search}
                    placeholder=" "
                  />
                </FormControl>
                <SelectPlan
                  variant="none"
                  onChange={handleChange}
                  name="commission_package"
                />
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
                  onClick={() => fetchData(values)}
                >
                  Search
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <Box p={6} bgColor={"#FFF"} rounded={4} boxShadow={"base"}>
        <Stack
          w={"full"}
          direction={["column", "row"]}
          alignItems={"center"}
          justifyContent={["center", "space-between"]}
        >
          <ExportButtons service="users" fileName="Users" />
          <Pagination pages={pages} onClick={(url:any) => setUrl(url)} />
        </Stack>
        <br />
        <TableContainer maxH={"lg"} overflowY={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>Profile</Th>
                <Th color={"gray.600"}>Wallet No.</Th>
                <Th color={"gray.600"}>Basic Details</Th>
                <Th color={"gray.600"}>Aadhaar</Th>
                <Th color={"gray.600"}>PAN</Th>
                <Th color={"gray.600"}>Plan Details</Th>
                <Th color={"gray.600"}>Created At</Th>
                <Th color={"gray.600"}>Admin Remarks</Th>
                <Th color={"gray.600"}>Action</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td>
                    <Avatar
                      name={item?.name}
                      src={
                        item?.documents?.find(
                          (doc: any) => doc?.document_type == "avatar"
                        )
                          ? API_BASE_URL?.replace("/api", "/") +
                            item?.documents?.find(
                              (doc: any) => doc?.document_type == "avatar"
                            )?.address
                          : null
                      }
                      as={"a"}
                      href={
                        item?.documents?.find(
                          (doc: any) => doc?.document_type == "avatar"
                        )
                          ? API_BASE_URL?.replace("/api", "/") +
                            item?.documents?.find(
                              (doc: any) => doc?.document_type == "avatar"
                            )?.address
                          : "#"
                      }
                      target={
                        item?.documents?.find(
                          (doc: any) => doc?.document_type == "avatar"
                        )
                          ? "_blank"
                          : "_self"
                      }
                    />
                  </Td>
                  <Td borderBottom={0}>{item?.wallet_id}</Td>
                  <Td>
                    <Text>
                      {item?.name ||
                        item?.first_name + item?.middle_name + item?.last_name}
                    </Text>
                    <Text>{item?.email}</Text>
                    <Text>{item?.phone_number}</Text>
                  </Td>
                  <Td>
                    <Text>{item?.aadhaar_number}</Text>
                    <HStack w={"full"}>
                      {item?.documents?.find(
                        (doc: any) => doc?.document_type == "aadhaar_front"
                      ) ? (
                        <Button
                          size={"xs"}
                          rounded={"full"}
                          colorScheme="twitter"
                          onClick={() =>
                            adminDownloadMedia({
                              url: item?.documents?.find(
                                (doc: any) =>
                                  doc?.document_type == "aadhaar_front"
                              )?.address,
                              filename: `${item?.documents
                                ?.find(
                                  (doc: any) =>
                                    doc?.document_type == "aadhaar_front"
                                )
                                ?.address?.replace(
                                  "users/aadhaar_front/",
                                  ""
                                )}`,
                            })
                          }
                        >
                          Front
                        </Button>
                      ) : null}
                      {item?.documents?.find(
                        (doc: any) => doc?.document_type == "aadhaar_back"
                      ) ? (
                        <Button
                          size={"xs"}
                          rounded={"full"}
                          colorScheme="twitter"
                          onClick={() =>
                            adminDownloadMedia({
                              url: item?.documents?.find(
                                (doc: any) =>
                                  doc?.document_type == "aadhaar_back"
                              )?.address,
                              filename: `${item?.documents
                                ?.find(
                                  (doc: any) =>
                                    doc?.document_type == "aadhaar_back"
                                )
                                ?.address?.replace("users/aadhaar_back/", "")}`,
                            })
                          }
                        >
                          Back
                        </Button>
                      ) : null}
                    </HStack>
                  </Td>
                  <Td>
                    <Text>{item?.pan_number}</Text>
                    {item?.documents?.find(
                      (doc: any) => doc?.document_type == "pan"
                    ) ? (
                      <Button
                        size={"xs"}
                        rounded={"full"}
                        colorScheme="twitter"
                        onClick={() =>
                          adminDownloadMedia({
                            url: item?.documents?.find(
                              (doc: any) => doc?.document_type == "pan"
                            )?.address,
                            filename: `${item?.documents
                              ?.find((doc: any) => doc?.document_type == "pan")
                              ?.address?.replace("users/pan/", "")}`,
                          })
                        }
                      >
                        PAN Card
                      </Button>
                    ) : null}
                  </Td>
                  <Td borderBottom={0}>
                    <Text>
                      <strong>Package Name: </strong>
                      {item?.plan?.name}
                    </Text>
                    <Text>
                      <strong>Wallet Balance: </strong>₹
                      {Number(item?.wallet)?.toLocaleString("en-IN") ?? 0}
                    </Text>
                    <Text>
                      <strong>Min. Balance: </strong>₹
                      {Number(item?.capped_balance)?.toLocaleString("en-IN") ??
                        0}
                    </Text>
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.created_at).toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0}>{item?.admin_remarks || "-"}</Td>
                  <Td borderBottom={0}>
                    <HStack gap={4} w={"full"} justifyContent={"center"}>
                      <Menu closeOnSelect={false}>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          size={"sm"}
                          bgColor={"brand.primary"}
                          _hover={{
                            bgColor: "brand.hover",
                          }}
                          color={"#FFF"}
                          fontWeight={"medium"}
                        >
                          Actions
                        </MenuButton>
                        <MenuList>
                          <MenuItem>
                            <HStack w={"full"} justifyContent={"space-between"}>
                              <Text>
                                {Boolean(item?.deleted_at)
                                  ? "User is Blocked"
                                  : "User is Active"}
                              </Text>
                              <Switch
                                isChecked={!Boolean(item?.deleted_at)}
                                onChange={async (e) => {
                                  if (e.target.checked) {
                                    await unblockUser(item?.id);
                                  } else {
                                    await blockUser(item?.id);
                                  }
                                }}
                              />
                            </HStack>
                          </MenuItem>
                          <MenuItem>
                            <HStack w={"full"} justifyContent={"space-between"}>
                              <Text>{"Onboarding"}</Text>
                              <Switch
                                isChecked={Boolean(item?.active)}
                                onChange={async (e) => {
                                  if (e.target.checked) {
                                    await updateUser(item?.id, { active: 1 });
                                  } else {
                                    await updateUser(item?.id, { active: 0 });
                                  }
                                }}
                              />
                            </HStack>
                          </MenuItem>
                          <MenuItem
                            as={"a"}
                            href={`/admin/dashboard/users/edit/${item?.id}`}
                            target="_blank"
                          >
                            Edit Details
                          </MenuItem>
                          <MenuItem onClick={() => sendPassword(item?.id)}>
                            Send Password
                          </MenuItem>
                          <MenuItem onClick={() => sendPin(item?.id)}>
                            Send PIN
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setUpdateUserId(item?.id);
                              setRemarks(item?.admin_remarks);
                              onOpen();
                            }}
                          >
                            Add Remarks
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              window.open(
                                `/admin/dashboard/reports/ledger?user_id=${item?.phone_number}`,
                                "_blank"
                              )
                            }
                          >
                            View Ledger
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <br />
        <Pagination pages={pages} onClick={(url:any) => setUrl(url)} />
      </Box>

      {/* Add Admin Remarks To User */}
      <CustomModal
        title={"Add Remarks"}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => addRemarks()}
      >
        <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </CustomModal>
    </>
  );
};

export default page;
