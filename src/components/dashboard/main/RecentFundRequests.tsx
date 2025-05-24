"use client";
import CustomModal from "@/components/misc/CustomModal";
import Pagination from "@/components/misc/Pagination";
import { API } from "@/lib/api";
import useAuth from "@/lib/hooks/useAuth";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API_BASE_URL } from "@/lib/utils/constants";
import {
  Avatar,
  Button,
  HStack,
  IconButton,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaClock } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoReceipt } from "react-icons/io5";

interface RecentFundRequestsProps {
  showPagination?: boolean;
}

const RecentFundRequests = ({
  showPagination = true,
}: RecentFundRequestsProps) => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [data, setData] = useState([]);
  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getMyRequests();
    }
  }, []);

  async function getMyRequests(url?: string, query?: object) {
    try {
      const from = format(selectedDates[0], "yyyy-MM-dd");
      const to = format(selectedDates[1], "yyyy-MM-dd");
      const res = await API.reportFundRequests(url, {
        ...query,
        from: from,
        to: to,
        status: "pending",
      });
      setData(res?.data);
      setPages(res?.meta?.links);
    } catch (error) {
      handleError({ title: "Couldn't fetch fund requests", error: error });
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
                <Td borderBottom={0}>
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
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RecentFundRequests;
