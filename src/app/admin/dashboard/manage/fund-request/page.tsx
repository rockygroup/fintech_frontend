"use client";
import PendingFundRequests from "@/components/dashboard/main/admin/PendingFundRequests";
import SelectPortalBank from "@/components/dashboard/misc/select/SelectPortalBank";
import CustomButton from "@/components/misc/CustomButton";
import CustomModal from "@/components/misc/CustomModal";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API_BASE_URL } from "@/lib/utils/constants";
import {
  Avatar,
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoReceipt } from "react-icons/io5";

const page = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [targetRequestId, setTargetRequestId] = useState<
    string | number | null
  >("");
  const [approveTargetRequest, setApproveTargetRequest] = useState({
    id: null,
    amount: null,
  });
  const [pages, setPages] = useState<any>([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getData("", {});
    }
  }, []);

  async function getData(url?: string, query?: object) {
    try {
      setIsLoading(true);
      const res = await API.adminPendingFundRequests(url, query);
      setData(res?.data);
      setPages(res?.meta?.links);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't fetch fund requests", error: error });
    }
  }

  async function approveRequest(id: string | number) {
    try {
      setIsLoading(true);
      await API.adminApproveFundRequest(id);
      await getData();
      setApproveTargetRequest({ id: null, amount: null });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't update fund request", error: error });
    }
  }

  async function rejectRequest() {
    setIsLoading(true);
    try {
      await API.adminRejectFundRequest(targetRequestId, adminRemarks);
      await getData();
      setTargetRequestId(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't update fund request", error: error });
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Pending Fund Requests
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            request_id: "",
            transaction_id: "",
            requested_bank: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack direction={["column", "row"]} gap={8} mb={8}>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="transaction_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Transaction ID</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="request_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Request ID</FormLabel>
                </FormControl>
                <SelectPortalBank
                  name="requested_bank"
                  onChange={handleChange}
                />
              </Stack>
              <HStack justifyContent={"flex-end"}>
                <CustomButton onClick={() => getData("", values)}>
                  Search
                </CustomButton>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <br />
      <br />

      <Box my={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <HStack
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
          mt={8}
          overflowX={"scroll"}
          className="hide-scrollbar"
        >
          <Pagination
            pages={pages}
            onClick={(value: string) => getData(value, {})}
          />
        </HStack>
        <TableContainer maxH={"lg"} overflowY={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>Trnxn ID</Th>
                <Th color={"gray.600"}>Amount</Th>
                <Th color={"gray.600"}>Bank</Th>
                <Th color={"gray.600"}>Status</Th>
                <Th color={"gray.600"}>User</Th>
                <Th color={"gray.600"}>User Remarks</Th>
                <Th color={"gray.600"}>Req. At</Th>
                <Th color={"gray.600"}>Action</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key: number) => (
                <Tr key={key}>
                  <Td borderBottom={0}>{item?.transaction_id}</Td>
                  <Td borderBottom={0}>
                    ₹{Number(item?.amount)?.toLocaleString("en-IN") ?? 0}
                  </Td>
                  <Td borderBottom={0}>{item?.bank?.name}</Td>
                  <Td>
                    <Badge textTransform={"uppercase"}>{item?.status}</Badge>
                  </Td>
                  <Td>
                    <HStack alignItems={"flex-start"}>
                      <Avatar size={"xs"} name={item?.user?.name} />
                      <Text>
                        {item?.user?.name} ({item?.user?.phone_number})
                      </Text>
                    </HStack>
                  </Td>
                  <Td>{item?.user_remarks}</Td>
                  {/* <Td>
                    <HStack alignItems={"flex-start"}>
                      <Avatar size={"xs"} name={item?.reviewer?.name} />
                      <Text>{item?.reviewer?.name}</Text>
                    </HStack>
                  </Td> */}
                  <Td borderBottom={0}>
                    {new Date(item?.created_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0} textAlign={"center"}>
                    {item?.status == "pending" ? (
                      <HStack gap={4} w={"full"} justifyContent={"center"}>
                        <Button
                          aria-label="approve"
                          size={"xs"}
                          rounded={"full"}
                          leftIcon={<FaCheck />}
                          colorScheme="whatsapp"
                          onClick={() =>
                            setApproveTargetRequest({
                              id: item?.id,
                              amount: item?.amount,
                            })
                          }
                          isLoading={isLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          aria-label="reject"
                          size={"xs"}
                          rounded={"full"}
                          leftIcon={<FaXmark />}
                          colorScheme="red"
                          onClick={() => setTargetRequestId(item?.id)}
                          isLoading={isLoading}
                        >
                          Reject
                        </Button>
                      </HStack>
                    ) : null}
                    <br />
                    <IconButton
                      aria-label="view-receipt"
                      size={"xs"}
                      rounded={"full"}
                      icon={<IoReceipt />}
                      colorScheme="twitter"
                      onClick={() =>
                        window.open(
                          `${API_BASE_URL.replace("api", "storage")}/${
                            item?.receipt
                          }`,
                          "_blank"
                        )
                      }
                      isLoading={isLoading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <CustomModal
        title={"Enter Remarks"}
        isOpen={Boolean(targetRequestId)}
        onClose={() => setTargetRequestId(null)}
        onSubmit={() => rejectRequest()}
        isLoading={isLoading}
        hideFooter={false}
      >
        <Input onChange={(e) => setAdminRemarks(e.target.value)} />
      </CustomModal>

      <CustomModal
        title={`Approve ₹${approveTargetRequest?.amount} request?`}
        isOpen={Boolean(approveTargetRequest?.id)}
        onClose={() => setApproveTargetRequest({ id: null, amount: null })}
        onSubmit={() => approveRequest(approveTargetRequest?.id)}
        isLoading={isLoading}
        hideFooter={false}
        submitText="Approve"
      >
        <Text>Are you sure you want to approve this request?</Text>
      </CustomModal>
    </>
  );
};

export default page;
