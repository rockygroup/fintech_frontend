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
import { IoReceipt } from "react-icons/io5";
import { API_BASE_URL } from "@/lib/utils/constants";

const page = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);
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
      const res = await API.reportFundRequests(url, {
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

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Transaction Ledger
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            transaction_id: "",
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

        <TableContainer maxH={"sm"} overflowY={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>ID</Th>
                <Th color={"gray.600"}>Amount</Th>
                <Th color={"gray.600"}>Admin</Th>
                <Th color={"gray.600"}>Bank</Th>
                <Th color={"gray.600"}>Req. At</Th>
                <Th color={"gray.600"}>Status</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td borderBottom={0}>{item?.transaction_id}</Td>
                  <Td borderBottom={0}>
                    ₹{Number(item?.amount)?.toLocaleString("en-IN") ?? 0}
                  </Td>
                  <Td>
                    {item?.status != "pending" && item?.reviewer?.id ? (
                      <HStack alignItems={"flex-start"}>
                        <Avatar size={"xs"} name={item?.reviewer?.name} />
                        <Text>{item?.reviewer?.name}</Text>
                      </HStack>
                    ) : null}
                  </Td>
                  <Td borderBottom={0}>{item?.bank?.name}</Td>
                  <Td borderBottom={0}>
                    {new Date(item?.created_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0} textAlign={"center"}>
                    <HStack gap={4} w={"full"} justifyContent={"center"}>
                      {item?.status == "approved" ? (
                        <Button
                          aria-label="approved"
                          size={"xs"}
                          rounded={"full"}
                          leftIcon={<FaCheck />}
                          colorScheme="whatsapp"
                        >
                          Approved
                        </Button>
                      ) : item?.status == "rejected" ? (
                        <Button
                          aria-label="rejected"
                          size={"xs"}
                          rounded={"full"}
                          leftIcon={<FaXmark />}
                          colorScheme="red"
                        >
                          Rejected
                        </Button>
                      ) : item?.status == "pending" ? (
                        <Button
                          aria-label="pending"
                          size={"xs"}
                          rounded={"full"}
                          leftIcon={<FaClock />}
                          colorScheme="twitter"
                        >
                          Pending
                        </Button>
                      ) : null}
                    </HStack>
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
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default page;
