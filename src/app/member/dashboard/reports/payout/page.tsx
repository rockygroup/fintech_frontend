"use client";
import CustomButton from "@/components/misc/CustomButton";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Badge,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
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
import ReceiptButton from "@/components/dashboard/misc/ReceiptButton";
import { format } from "date-fns";
import StatusBadge from "@/components/dashboard/reports/StatusBadge";

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
  const [formData, setFormData] = useState<any>({});

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
      setFormData({ ...query, from: from, to: to });
      const res = await API.reportPayouts(url, {
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
        Payout Report
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            transaction_id: "",
            account_number: "",
            utr: "",
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
                flexWrap={"wrap"}
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
                  <Input
                    name="utr"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Bank Ref. ID (UTR)</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="account_number"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Beneficiary Acc.</FormLabel>
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
            fileName={"Payouts"}
            service="payouts"
            query={formData}
          />
          <Pagination
            pages={pages}
            onClick={(value: string) => getData(value, {})}
          />
        </HStack>

        <TableContainer maxH={"sm"} overflowY={"scroll"} overflowX={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>Trnxn ID</Th>
                <Th color={"gray.600"}>Amount</Th>
                <Th color={"gray.600"}>Status</Th>
                <Th color={"gray.600"}>Bank Ref. ID (UTR)</Th>
                <Th color={"gray.600"}>Beneficiary</Th>
                <Th color={"gray.600"}>Provider/Mode</Th>
                <Th color={"gray.600"}>Created At</Th>
                <Th color={"gray.600"}>Updated At</Th>
                <Th color={"gray.600"}>Receipt</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td borderBottom={0}>{item?.reference_id}</Td>
                  <Td borderBottom={0}>
                    ₹{Number(item?.amount)?.toLocaleString("en-IN") ?? 0}
                  </Td>
                  <Td>
                    <StatusBadge status={item?.status} />
                  </Td>
                  <Td>{item?.utr}</Td>
                  <Td>
                    <Text>{item?.beneficiary_name}</Text>
                    <Text>{item?.account_number}</Text>
                    <Text>{item?.ifsc_code}</Text>
                  </Td>
                  <Td textTransform={"uppercase"}>
                    {item?.provider} / {item?.mode}
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.created_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.updated_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td>
                    <ReceiptButton
                      data={{
                        type: "payout",
                        transaction_id: item?.reference_id?.toUpperCase(),
                        amount: item?.amount,
                        status: item?.status,
                        timestamp: item?.created_at,
                        miscData: {
                          beneficiary: item?.beneficiary_name,
                          account_no: item?.account_number,
                          IFSC: item?.ifsc_code?.toUpperCase(),
                          UTR: item?.utr?.toUpperCase()
                        },
                      }}
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
