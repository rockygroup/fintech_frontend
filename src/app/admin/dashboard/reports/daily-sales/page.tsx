"use client";
import ExportButtons from "@/components/dashboard/misc/ExportButtons";
import CustomButton from "@/components/misc/CustomButton";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useAuth from "@/lib/hooks/useAuth";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const { user, authUser } = useAuth();

  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setDate(new Date().getDate())),
    new Date(new Date().setDate(new Date().getDate())),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [pages, setPages] = useState([]);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (ref.current && user?.id) {
        ref.current = false;
        await getData();
      } else if (!user?.id) {
        await authUser();
      }
    })();
    console.log(user?.id);
  }, [user]);

  function calculateSum(
    jsonData: any,
    transactionType: "payout" | "payout_commission"
  ) {
    let totalDebit = 0;
    let totalCredit = 0;

    // Iterate over each user's transactions
    for (const userId in jsonData) {
      const transactions = jsonData[userId];

      // Sum up debit_amount and credit_amount for 'payout' services
      transactions.forEach((transaction: any) => {
        if (transaction.service === transactionType) {
          const debitAmount = parseFloat(transaction.total_debit_amount);
          const creditAmount = parseFloat(transaction.total_credit_amount);
          totalDebit += debitAmount;
          totalCredit += creditAmount;
        }
      });
    }

    // Calculate the net amount of all payouts
    const netAmount = totalDebit - totalCredit;
    return netAmount;
  }

  async function getData(url?: string, query?: object) {
    setIsLoading(true);
    try {
      const from = format(selectedDates[0], "yyyy-MM-dd");
      const to = format(selectedDates[1], "yyyy-MM-dd");
      setFormData({ ...query, from: from, to: to });
      const res = await API.adminReportDailySales(url, {
        ...query,
        from: from,
        to: to,
      });

      if (Object?.entries(res?.data)?.map((item) => item[1])) {
        setData(Object?.entries(res?.data)?.map((item) => item[1]));
        setPages(res?.meta?.links);
      }

      setIsLoading(false);
      console.log(Object?.entries(res?.data)?.map((item) => item[1]));
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
        Daily Sales
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            receiver_id: "",
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
                    name="receiver_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
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

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <HStack
          w={"full"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={8}
          overflowX={"scroll"}
          className="hide-scrollbar"
        >
          <Pagination
            pages={pages}
            onClick={(value: string) => getData(value, {})}
          />
        </HStack>

        <TableContainer maxH={"sm"} overflowY={"scroll"} overflowX={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <TableCaption placement="top">
              Negative amount means the amount has been credited to the user
            </TableCaption>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>User</Th>
                <Th color={"gray.600"} isNumeric>Payout</Th>
                <Th color={"gray.600"} isNumeric>Payout Fees</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key: number) => (
                <Tr key={key}>
                  <Td>{item[0]?.user_name}</Td>
                  <Td borderBottom={0} isNumeric>
                    ₹
                    {(
                      item?.find((_:any) => _?.service == "payout")
                        ?.total_debit_amount -
                        item?.find((_:any) => _?.service == "payout")
                          ?.total_credit_amount || 0
                    )?.toLocaleString("en-IN") || 0}
                  </Td>
                  <Td borderBottom={0} isNumeric>
                    ₹
                    {(
                      item?.find((_:any) => _?.service == "payout_commission")
                        ?.total_debit_amount -
                        item?.find((_:any) => _?.service == "payout_commission")
                          ?.total_credit_amount || 0
                    )?.toLocaleString("en-IN") || 0}
                  </Td>
                </Tr>
              ))}
                <Tr>
                  <Th>Total</Th>
                  <Th isNumeric>₹{Number(calculateSum(data, "payout"))?.toLocaleString("en-IN")}</Th>
                  <Th isNumeric>₹{Number(calculateSum(data, "payout_commission"))?.toLocaleString("en-IN")}</Th>
                </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default page;
