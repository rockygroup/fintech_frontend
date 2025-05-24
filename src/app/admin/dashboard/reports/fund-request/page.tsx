"use client";
import CustomButton from "@/components/misc/CustomButton";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
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
import React, { useState, useEffect, useRef } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import ExportButtons from "@/components/dashboard/misc/ExportButtons";
import TransactionBadge from "@/components/dashboard/misc/TransactionBadge";
import { format } from "date-fns";
import { FaCheck, FaClock } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { API_BASE_URL } from "@/lib/utils/constants";
import { IoReceipt } from "react-icons/io5";
import CustomModal from "@/components/misc/CustomModal";

const page = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);

  const [approveTargetRequest, setApproveTargetRequest] = useState({
    id: null,
    amount: null,
  });
  const [targetRequestId, setTargetRequestId] = useState<any>("");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(new Date().setDate(new Date().getDate() + 1)),
  ]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getData();
    }
  }, []);

  async function getData(url?: string, query?: object) {
    setIsLoading(true);
    try {
      const from = format(selectedDates[0], "yyyy-MM-dd");
      const to = format(selectedDates[1], "yyyy-MM-dd");
      setFormData({
        ...query,
        from: from,
        to: to,
      });
      const res = await API.adminReportFundRequests(url, {
        ...query,
        from: from,
        to: to,
      });
      setData(res?.data);
      setPages(res?.meta?.links);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Could not fetch data",
        error: error,
      });
    }
  }

  async function approveRequest(id: string | number) {
    try {
      setIsLoading(true);
      await API.adminApproveFundRequest(id);
      await getData();
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
        Fund Request Report
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            transaction_id: "",
            user_id: "",
            status: "",
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack
                direction={["column", "row"]}
                alignItems={"flex-end"}
                gap={8}
                mb={8}
              >
                <FormControl maxW={["full", "xs"]}>
                  <FormLabel>Dates</FormLabel>
                  <RangeDatepicker
                    selectedDates={selectedDates}
                    onDateChange={setSelectedDates}
                  />
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="user_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>User Phone</FormLabel>
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
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Select name="status" onChange={handleChange}>
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                  <FormLabel>Transaction ID</FormLabel>
                </FormControl>
              </Stack>
              <HStack justifyContent={"flex-end"}>
                <CustomButton
                  onClick={() => getData("", values)}
                  isLoading={isLoading}
                >
                  Search
                </CustomButton>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>
      <br />
      <br />
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <HStack
          w={"full"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={8}
          overflowX={"scroll"}
          className="hide-scrollbar"
        >
          <ExportButtons
            fileName="FundRequests"
            service="fund-requests"
            query={formData}
          />
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
                <Th color={"gray.600"}>Updated By</Th>
                <Th color={"gray.600"}>User Remarks</Th>
                <Th color={"gray.600"}>Admin Remarks</Th>
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
                    <Badge
                      textTransform={"uppercase"}
                      colorScheme={
                        item?.status == "approved"
                          ? "whatsapp"
                          : item?.status == "rejected"
                          ? "red"
                          : "twitter"
                      }
                    >
                      {item?.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack alignItems={"flex-start"}>
                      <Avatar size={"xs"} name={item?.user?.name} />
                      <Text>
                        {item?.user?.name} ({item?.user?.phone_number})
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    {item?.status != "pending" ? (
                      <HStack alignItems={"flex-start"}>
                        <Avatar size={"xs"} name={item?.reviewer?.name} />
                        <Text>{item?.reviewer?.name}</Text>
                      </HStack>
                    ) : null}
                  </Td>
                  <Td>{item?.user_remarks}</Td>
                  <Td borderBottom={0}>{item?.admin_remarks}</Td>
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
