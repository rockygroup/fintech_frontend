"use client";
import {
  Badge,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ReceiptButton from "../../misc/ReceiptButton";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import StatusBadge from "../../reports/StatusBadge";
import { format } from "date-fns";

const RecentPayouts = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(new Date().setDate(new Date().getDate() + 1)),
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
      const res = await API.reportPayouts("", {
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
        <TableContainer maxH={"sm"} overflowY={"scroll"}>
          <Table size={"md"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th color={"gray.600"}>ID</Th>
                <Th color={"gray.600"}>Amount</Th>
                <Th color={"gray.600"}>Beneficiary</Th>
                <Th color={"gray.600"}>Status</Th>
                <Th color={"gray.600"}>Provider</Th>
                <Th color={"gray.600"}>Description</Th>
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
                  <Td>
                    <Text>{item?.beneficiary_name}</Text>
                    <Text>{item?.account_number}</Text>
                    <Text>{item?.ifsc_code}</Text>
                  </Td>
                  <Td>
                    <StatusBadge status={item?.status} />
                  </Td>
                  <Td>
                    <Badge>{item?.provider}</Badge>
                  </Td>
                  <Td>{item?.description}</Td>
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
                        hideFooter: true,
                        hideLogo: true,
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
    </>
  );
};

export default RecentPayouts;
