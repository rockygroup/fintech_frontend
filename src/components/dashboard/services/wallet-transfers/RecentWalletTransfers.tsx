"use client";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import StatusBadge from "../../reports/StatusBadge";
import ReceiptButton from "../../misc/ReceiptButton";

const RecentWalletTransfers = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getData("", {});
    }
  }, []);

  async function getData(url?: string, query?: object) {
    try {
      const res = await API.reportWalletTransfers("", {
        ...query,
        from: format(selectedDates[0], "yyyy-MM-dd"),
        to: format(selectedDates[1], "yyyy-MM-dd"),
      });
      setData(res?.data);
    } catch (error) {
      handleError({
        title: "Error while fetching recent wallet transfers",
        error: error,
      });
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={4}>
        Recent Wallet Transfers
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <HStack justifyContent={"flex-end"}>
          <Button
            variant={"ghost"}
            onClick={() => getData("", {})}
            fontWeight={"medium"}
            rounded={"full"}
          >
            Refresh Data
          </Button>
        </HStack>
        <TableContainer maxH={"sm"} overflowY={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>ID</Th>
                <Th color={"gray.600"}>Amount</Th>
                <Th color={"gray.600"}>Beneficiary</Th>
                <Th color={"gray.600"}>Status</Th>
                <Th color={"gray.600"}>User Remarks</Th>
                <Th color={"gray.600"}>Created At</Th>
                <Th color={"gray.600"}>Updated At</Th>
                <Th color={"gray.600"}>Action</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={"xs"}>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td borderBottom={0}>{item?.reference_id}</Td>
                  <Td borderBottom={0}>
                    ₹{Number(item?.amount)?.toLocaleString("en-IN") ?? 0}
                  </Td>
                  <Td>{item?.receiver?.name}</Td>
                  <Td>
                    <StatusBadge status={item?.status} />
                  </Td>
                  <Td>{item?.user_remarks}</Td>
                  <Td borderBottom={0}>
                    {new Date(item?.created_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0}>
                    {new Date(item?.updated_at)?.toLocaleString("en-GB")}
                  </Td>
                  <Td borderBottom={0} textAlign={"center"}>
                    <ReceiptButton
                      data={{
                        status: item?.status,
                        transaction_id: item?.reference_id,
                        amount: item?.amount,
                        timestamp: item?.created_at,
                        type: "wallet-transfer",
                        miscData: {
                          beneficiary: item?.receiver?.name,
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

export default RecentWalletTransfers;
