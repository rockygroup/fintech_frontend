"use client";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  BoxProps,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
  Input,
  HStack,
  Tooltip,
} from "@chakra-ui/react";

import {
  FaBell,
  FaHandHoldingHeart,
  FaSatelliteDish,
  FaUser,
} from "react-icons/fa";
import { AiOutlineTeam, AiOutlineHome } from "react-icons/ai";
import {
  BsGear,
  BsClipboardDataFill,
  BsCalendar2CheckFill,
} from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import {
  IoFingerPrint,
  IoPhonePortraitOutline,
  IoWallet,
} from "react-icons/io5";
import { SiRazorpay } from "react-icons/si";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { FaIndianRupeeSign, FaMoneyBillTransfer } from "react-icons/fa6";
import ServerStatus from "@/components/dashboard/main/ServerStatus";
import MessageRibbon from "@/components/dashboard/main/MessageRibbon";
import { FC, ReactNode, useEffect, useState } from "react";
import Wallet from "@/components/dashboard/main/Wallet";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { PiGearSix } from "react-icons/pi";
import { HiPaintBrush } from "react-icons/hi2";
import useAuth from "@/lib/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Index: FC<LayoutProps> = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [role, setRole] = useState("admin");

  return (
    <>
      <Box
        as="section"
        bg={useColorModeValue("gray.50", "gray.700")}
        minH="100vh"
      >
        <AdminSidebarContent display={{ base: "none", md: "unset" }} />

        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <AdminSidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: "20%" }} transition=".3s ease">
          <MessageRibbon />

          <Flex
            as="header"
            align="center"
            justifyContent={{ base: "space-between", md: "space-between" }}
            w="full"
            px="4"
            py={8}
            gap={4}
          >
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={onOpen}
              icon={<FiMenu />}
              size="md"
            />

            <Input
              rounded={"full"}
              bgColor={"#FFF"}
              maxW={"xs"}
              placeholder="Search..."
              display={["none", "inline"]}
            />

            <Flex align="center" gap={4}>
              <Box
                p={3}
                rounded={"full"}
                bgColor={"#FFF"}
                display={"grid"}
                placeContent={"center"}
                boxShadow={"md"}
                cursor="pointer"
              >
                <Icon color="gray.500" as={FaBell} fontSize={20} />
              </Box>

              {/* <Wallet /> */}
            </Flex>
          </Flex>

          <Box
            as="main"
            p={4}
            w={"full"}
            minH="100vh"
            bg={useColorModeValue("auto", "gray.800")}
          >
            {children}
          </Box>
          <ServerStatus />
        </Box>
      </Box>
    </>
  );
};

const AdminSidebarContent = ({ ...props }: BoxProps) => {
  const pathname = usePathname();
  const {handleLogout} = useAuth()

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      p={[4, "8"]}
      overflowX="hidden"
      overflowY="auto"
      w={["full", "18%", "18%", "18%"]}
      {...props}
    >
      <Flex
        as={"a"}
        href="/admin/dashboard"
        px="4"
        pb={6}
        mb={4}
        align="center"
        borderBottom={"0.5px solid"}
        borderBottomColor={"gray.300"}
      >
        <Icon as={RiFlashlightFill} h={8} w={8} />
        <Text
          fontSize="xl"
          ml="2"
          color={useColorModeValue("brand.500", "white")}
          fontWeight="semibold"
        >
          {process.env.NEXT_PUBLIC_BRAND_NAME}
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="md"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem
          icon={AiOutlineHome}
          isActive={pathname == "/admin/dashboard"}
          link={"/admin/dashboard"}
        >
          Dashboard
        </NavItem>
        <NavItem
          icon={AiOutlineTeam}
          isActive={pathname?.split("/")?.includes("users")}
          link={"/admin/dashboard/users"}
        >
          Users
        </NavItem>
        <NavItem
          icon={FaUser}
          isActive={pathname?.split("/")?.includes("profile")}
          link={"/admin/dashboard/profile"}
        >
          Profile
        </NavItem>
        <NavItem
          icon={FaIndianRupeeSign}
          isActive={pathname?.split("/")?.includes("commission")}
          link={"/admin/dashboard/commission"}
        >
          Commission
        </NavItem>
        <br />
        <Text
          fontWeight={"semibold"}
          fontSize={"sm"}
          pb={2}
          mb={4}
          borderBottom={"0.5px solid"}
          borderBottomColor={"gray.300"}
        >
          PORTAL CONTROLS
        </Text>
        <NavItem
          icon={PiGearSix}
          isActive={pathname?.split("/")?.includes("settings")}
          link={"/admin/dashboard/settings"}
        >
          Settings
        </NavItem>
        <NavItem
          icon={HiPaintBrush}
          isActive={pathname?.split("/")?.includes("customise")}
          link={"/admin/dashboard/customise"}
        >
          Customise
        </NavItem>
        <NavItem
          icon={FaBell}
          isActive={pathname?.split("/")?.includes("alerts")}
          link={"/admin/dashboard/alerts"}
        >
          Alerts
        </NavItem>
        <br />
        <Text
          fontWeight={"semibold"}
          fontSize={"sm"}
          pb={2}
          mb={4}
          borderBottom={"0.5px solid"}
          borderBottomColor={"gray.300"}
        >
          MONEY
        </Text>
        <NavItem
          icon={GiReceiveMoney}
          isActive={
            pathname?.split("/")?.includes("fund-request") &&
            pathname?.split("/")?.includes("manage")
          }
          link={"/admin/dashboard/manage/fund-request"}
        >
          Fund Request
        </NavItem>
        {/* <NavItem
          icon={FaMoneyBillTransfer}
          isActive={
            pathname?.split("/")?.includes("fund-flow") &&
            pathname?.split("/")?.includes("manage")
          }
          link={"/admin/dashboard/manage/fund-flow"}
        >
          Fund Flow
        </NavItem> */}
        <br />
        <Text
          fontWeight={"semibold"}
          fontSize={"sm"}
          pb={2}
          mb={4}
          borderBottom={"0.5px solid"}
          borderBottomColor={"gray.300"}
        >
          REPORTS
        </Text>
        <NavItem
          icon={BsClipboardDataFill}
          isActive={
            pathname?.split("/")?.includes("ledger") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/ledger"}
        >
          Ledger
        </NavItem>
        <NavItem
          icon={GiReceiveMoney}
          isActive={
            pathname?.split("/")?.includes("fund-request") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/fund-request"}
        >
          Fund Request
        </NavItem>
        {/* <NavItem
          icon={FaUser}
          isActive={
            pathname?.split("/")?.includes("user-ledger") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/user-ledger"}
        >
          User Ledger
        </NavItem> */}
        <NavItem
          icon={BsCalendar2CheckFill}
          isActive={
            pathname?.split("/")?.includes("daily-sales") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/daily-sales"}
        >
          Daily Sales
        </NavItem>
        <NavItem
          icon={IoWallet}
          isActive={
            pathname?.split("/")?.includes("wallet-transfer") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/wallet-transfer"}
        >
          Wallet Transfer
        </NavItem>
        <NavItem
          icon={FaMoneyBillTransfer}
          isActive={
            pathname?.split("/")?.includes("fund-flow") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/fund-flow"}
        >
          Fund Flow
        </NavItem>
        {/* <NavItem
          icon={IoFingerPrint}
          isActive={
            pathname?.split("/")?.includes("aeps") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/aeps"}
        >
          AePS
        </NavItem>
        <NavItem
          icon={FaSatelliteDish}
          isActive={
            pathname?.split("/")?.includes("bill-pay") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/bill-pay"}
        >
          Bill Pay
        </NavItem> */}
        <NavItem
          icon={SiRazorpay}
          isActive={
            pathname?.split("/")?.includes("payout") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/payout"}
        >
          Payout
        </NavItem>
        {/* <NavItem
          icon={IoPhonePortraitOutline}
          isActive={
            pathname?.split("/")?.includes("recharge") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/recharge"}
        >
          Recharge
        </NavItem>
        <NavItem
          icon={GiTakeMyMoney}
          isActive={
            pathname?.split("/")?.includes("cms-deposit") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/cms-deposit"}
        >
          CMS Deposit
        </NavItem>
        <NavItem
          icon={FaHandHoldingHeart}
          isActive={
            pathname?.split("/")?.includes("lic") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/lic"}
        >
          LIC
        </NavItem>
        <NavItem
          icon={IoMdLogIn}
          isActive={
            pathname?.split("/")?.includes("logins") &&
            pathname?.split("/")?.includes("reports")
          }
          link={"/admin/dashboard/reports/lic"}
        >
          Login Report
        </NavItem> */}

        <br />
        <br />
        <br />
        <HStack
          px={4}
          py={2}
          w={"full"}
          rounded={8}
          alignItems={"center"}
          justifyContent={"center"}
          transition={"all .3s ease"}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
          color={"red.400"}
          onClick={handleLogout}
        >
          <Icon as={IoMdLogOut} boxSize={6} />
          <Text>Logout</Text>
        </HStack>
      </Flex>
    </Box>
  );
};

const NavItem = (props: any) => {
  const color = useColorModeValue("gray.600", "gray.300");

  const { icon, children, isActive = false, link } = props;
  return (
    <Flex
      align="center"
      px="4"
      py="2"
      mb={4}
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue("inherit", "gray.400")}
      rounded={4}
      boxShadow={isActive ? "base" : "none"}
      bgColor={isActive ? "#FFF" : "transparent"}
      _hover={{
        bg: "white",
      }}
      as={"a"}
      href={link ?? "#"}
    >
      {icon && (
        <Box
          mr="4"
          bgColor={isActive ? "brand.primary" : "#FFF"}
          p={2}
          rounded={4}
          display={"grid"}
          placeContent={"center"}
          _groupHover={{
            bgColor: "brand.primary",
          }}
          transition={"all .3s ease"}
        >
          <Icon
            fontSize={"lg"}
            color={isActive ? "#FFF" : "auto"}
            _groupHover={{
              color: "#FFF",
            }}
            as={icon}
          />
        </Box>
      )}
      {children}
    </Flex>
  );
};

export default Index;
