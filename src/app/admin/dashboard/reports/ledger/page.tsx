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
import React, { useState, useEffect, useRef, Suspense } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import ExportButtons from "@/components/dashboard/misc/ExportButtons";
import TransactionBadge from "@/components/dashboard/misc/TransactionBadge";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

const Ledger = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const params = useSearchParams()
  const userId = params.get("user_id")

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
      if(userId) getData("", {user_id: userId});
      else getData()
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
      const res = await API.adminLedger(url, {
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
            user_id: "",
            account_number: ""
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
                  <Input
                    name="user_id"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>User ID</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="account_number"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Account No.</FormLabel>
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
          <ExportButtons fileName="Ledger" service="ledger" query={formData} />
          <Pagination
            pages={pages}
            onClick={(value: string) => getData(value, {})}
          />
        </HStack>

        <TableContainer maxH={"xl"} overflowY={"scroll"} overflowX={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>Trnxn ID</Th>
                <Th color={"gray.600"}>User</Th>
                <Th color={"gray.600"}>Debit Amount</Th>
                <Th color={"gray.600"}>Credit Amount</Th>
                <Th color={"gray.600"}>Opening Balance</Th>
                <Th color={"gray.600"}>Closing Balance</Th>
                <Th color={"gray.600"}>Service</Th>
                <Th color={"gray.600"}>Description</Th>
                <Th color={"gray.600"}>Created At</Th>
                <Th color={"gray.600"}>Updated At</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td borderBottom={0}>{item?.reference_id}</Td>
                  <Td borderBottom={0}>{item?.beneficiary?.name} ({item?.beneficiary?.phone_number})</Td>
                  <Td borderBottom={0} isNumeric>
                    <Badge colorScheme="red" minW={16}>
                      ₹
                      {Number(item?.debit_amount)?.toLocaleString("en-IN") ?? 0}
                    </Badge>
                  </Td>
                  <Td borderBottom={0} isNumeric>
                    <Badge colorScheme="whatsapp" minW={16}>
                      ₹
                      {Number(item?.credit_amount)?.toLocaleString("en-IN") ??
                        0}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    ₹
                    {Number(item?.opening_balance)?.toLocaleString("en-IN") ??
                      0}
                  </Td>
                  <Td isNumeric>
                    ₹
                    {Number(item?.closing_balance)?.toLocaleString("en-IN") ??
                      0}
                  </Td>
                  <Td>
                    <HStack justifyContent={"center"}>
                      <TransactionBadge>{item?.service}</TransactionBadge>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize={"sm"}>{item?.description}</Text>
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.created_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.updated_at)?.toLocaleString("en-GB")}
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

const page = () => {
  return(
    <Suspense>
      <Ledger />
    </Suspense>
  )
}

export default page;
