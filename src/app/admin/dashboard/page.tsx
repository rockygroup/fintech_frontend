"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Link,
  Icon,
  SimpleGrid,
  Container,
  Stack,
  Box,
  Button,
} from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BiTransferAlt } from "react-icons/bi";
import RecentFundRequests from "@/components/dashboard/main/RecentFundRequests";
import RecentTransactions from "@/components/dashboard/main/RecentTransactions";
import CustomTabs from "@/components/misc/CustomTabs";
import { FaMoneyBillTransfer, FaUsers } from "react-icons/fa6";
import useAuth from "@/lib/hooks/useAuth";
import PendingFundRequests from "@/components/dashboard/main/admin/PendingFundRequests";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API } from "@/lib/api";

interface StatData {
  id: number;
  label: string;
  score: string | number;
  icon: any;
  percentage: string;
}

const tabList = [
  {
    id: "today",
    label: "Today",
  },
  {
    id: "month",
    label: "This Month",
  },
  {
    id: "year",
    label: "This Year",
  },
];

const statData = [
  {
    id: 1,
    label: "Pending Fund Requests",
    score: "₹0",
    icon: FaWallet,
    percentage: "10%",
  },
  {
    id: 2,
    label: "Approved Fund Requests",
    score: "₹0",
    icon: FaWallet,
    percentage: "10%",
  },
  {
    id: 3,
    label: "Total Payouts",
    score: "₹0",
    icon: MdOutlineAttachMoney,
    percentage: "30%",
  },
  {
    id: 4,
    label: "Fund Transfers",
    score: "₹0",
    icon: FaMoneyBillTransfer,
    percentage: "30%",
  },
  {
    id: 5,
    label: "Wallet Balance",
    score: "₹0",
    icon: BiTransferAlt,
    percentage: "30%",
  },
  {
    id: 6,
    label: "Retailers",
    score: "0",
    icon: FaUsers,
    percentage: "30%",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const [overviewData, setOverviewData] = useState(statData);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchOverviewData("today");
    }
  }, []);

  useEffect(() => {
    console.log(overviewData);
  }, [overviewData]);

  async function fetchOverviewData(duration: string) {
    try {
      const res = await API.adminOverview(duration);
      let existingData = statData;
      const newData = res?.data;
      existingData[0].score = `₹${newData?.pending_fund_requests}`;
      existingData[1].score = `₹${newData?.approved_fund_requests}`;
      existingData[2].score = `₹${newData?.total_payouts}`;
      existingData[3].score = `₹${newData?.fund_transfers}`;
      existingData[4].score = `₹${newData?.volume}`;
      existingData[5].score = `${newData?.retailers}`;
      setOverviewData([
        {
          id: 1,
          label: "Pending Fund Requests",
          score: `₹${newData?.pending_fund_requests}`,
          icon: FaWallet,
          percentage: "10%",
        },
        {
          id: 2,
          label: "Approved Fund Requests",
          score: `₹${newData?.approved_fund_requests}`,
          icon: FaWallet,
          percentage: "10%",
        },
        {
          id: 3,
          label: "Total Payouts",
          score: `₹${newData?.total_payouts}`,
          icon: MdOutlineAttachMoney,
          percentage: "30%",
        },
        {
          id: 4,
          label: "Fund Transfers",
          score: `₹${newData?.fund_transfers}`,
          icon: FaMoneyBillTransfer,
          percentage: "30%",
        },
        {
          id: 5,
          label: "Wallet Balance",
          score: `₹${newData?.volume}`,
          icon: BiTransferAlt,
          percentage: "30%",
        },
        {
          id: 6,
          label: "Retailers",
          score: `${newData?.retailers}`,
          icon: FaUsers,
          percentage: "30%",
        },
      ]);
    } catch (error) {
      handleError({
        title: "Err while fetching overview data",
        error: error,
      });
    }
  }

  return (
    <>
      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={8}
      >
        <Text fontSize={["sm", "md"]} fontWeight={"medium"} color={"gray.700"}>
          Welcome back,{" "}
          {user?.name ? user?.name?.toUpperCase() : user?.roles?.toUpperCase()}!
        </Text>
        <CustomTabs
          tabList={tabList}
          onChange={(value) => fetchOverviewData(value)}
          size={["sm", "sm"]}
        />
      </Stack>
      <Stack
        direction={["column", "row"]}
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        gap={5}
        mb={4}
      >
        {overviewData.map((item, index) => (
          <Card
            key={index}
            icon={item?.icon}
            label={item?.label}
            score={item?.score}
            id={item?.id}
            percentage="0"
          />
        ))}
      </Stack>
      <Stack direction={["column", "row"]} gap={6}>
        <Box p={6} bgColor={"#FFF"} rounded={8} boxShadow={"sm"}>
          <Text color={"gray.700"} fontWeight={"semibold"}>
            Pending Fund Requests
          </Text>
          <Text
            color={"gray.500"}
            fontSize={"xs"}
            as={"a"}
            href={"/admin/dashboard/manage/fund-request"}
            pb={4}
          >
            View All
          </Text>
          <PendingFundRequests showPagination={false} status="pending" />
        </Box>
        {/* <Box flex={3} p={6} bgColor={"#FFF"} rounded={8} boxShadow={"sm"}>
          <Text color={"gray.700"} fontWeight={"semibold"}>
            Recent Transactions
          </Text>
          <Text
            color={"gray.500"}
            fontSize={"xs"}
            as={"a"}
            href={"/admin/dashboard/reports/ledger"}
            pb={4}
          >
            View All
          </Text>
          <RecentTransactions />
        </Box> */}
      </Stack>
    </>
  );
};

const Card = ({ label, score, icon, id, percentage }: StatData) => {
  // const { label, score, icon, id, percentage } = data;
  console.log(score);
  return (
    <Stack
      direction="column"
      rounded="8"
      boxShadow={"sm"}
      w={["100%", "xs"]}
      textAlign="left"
      align="start"
      spacing={0}
      role="group"
      overflow="hidden"
    >
      <HStack
        py={6}
        px={5}
        spacing={4}
        bgColor={"#FFF"}
        w="100%"
        justifyContent={"space-between"}
      >
        <VStack spacing={0} align="start" maxW="lg" h="100%">
          <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
            {label}
          </Text>
          <HStack spacing={2}>
            <Text as="h2" fontSize="lg" fontWeight="extrabold">
              {score}
            </Text>
          </HStack>
        </VStack>
        <Flex
          justifyContent="center"
          alignItems="center"
          rounded="lg"
          p={2}
          bg="brand.primary"
          position="relative"
          w={12}
          h={12}
          overflow="hidden"
          lineHeight={0}
          boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
        >
          <Icon as={icon} w={6} h={6} color="white" />
        </Flex>
      </HStack>
    </Stack>
  );
};

export default Dashboard;
