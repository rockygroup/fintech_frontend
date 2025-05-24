"use client";
import CustomEditableInput from "@/components/misc/CustomEditableInput";
import CustomTabs from "@/components/misc/CustomTabs";
import {
  Button,
  HStack,
  IconButton,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPlus, FaSatelliteDish, FaTrash } from "react-icons/fa";

const BillPaySchema = () => {
  const [data, setData] = useState([
    {
      from: "",
      to: "",
      retailer_commission: "",
      is_retailer_commission_flat: false,
      distributor_commission: "",
      is_distributor_commission_flat: false,
      super_distributor_commission: "",
      is_super_distributor_commission_flat: false,
      service_charge: "",
      is_service_charge_flat: false,
    },
  ]);
  return (
    <>
      <TableContainer maxH={"sm"} overflowY={"scroll"}>
        <Table size={"md"} variant={"striped"}>
          <Thead>
            <Tr color={"gray.600"}>
              <Th>Operator</Th>
              <Th>From (₹)</Th>
              <Th>To (₹)</Th>
              <Th>Retailer Commission</Th>
              <Th>Distributor Commission</Th>
              <Th>Super Distributor Comm.</Th>
              <Th>Service Charge</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody fontSize={"xs"}>
            {data?.map((item, key) => (
              <Tr key={key}>
                <Td>Airtel Prepaid</Td>
                <Td>
                  <CustomEditableInput defaultValue="0" />
                </Td>
                <Td>
                  <CustomEditableInput defaultValue="5000" />
                </Td>
                <Td>
                  <HStack gap={4} w={"full"} justifyContent={"center"}>
                    <CustomEditableInput width={"80%"} defaultValue="5" />
                    <CustomTabs
                      tabList={[
                        { id: "flat", label: "₹" },
                        { id: "percent", label: "%" },
                      ]}
                      onChange={console.log}
                      size={"xs"}
                      boxShadow={'none'}
                    />
                  </HStack>
                </Td>
                <Td>
                  <HStack gap={4} w={"full"} justifyContent={"center"}>
                    <CustomEditableInput width={"80%"} defaultValue="5" />
                    <CustomTabs
                      tabList={[
                        { id: "flat", label: "₹" },
                        { id: "percent", label: "%" },
                      ]}
                      onChange={console.log}
                      size={"xs"}
                      boxShadow={'none'}
                    />
                  </HStack>
                </Td>
                <Td>
                  <HStack gap={4} w={"full"} justifyContent={"center"}>
                    <CustomEditableInput width={"80%"} defaultValue="5" />
                    <CustomTabs
                      tabList={[
                        { id: "flat", label: "₹" },
                        { id: "percent", label: "%" },
                      ]}
                      onChange={console.log}
                      size={"xs"}
                      boxShadow={'none'}
                    />
                  </HStack>
                </Td>
                <Td>
                  <HStack w={"full"} justifyContent={"center"}>
                    <CustomEditableInput width={"50%"} defaultValue="5" />
                    <CustomTabs
                      tabList={[
                        { id: "flat", label: "₹" },
                        { id: "percent", label: "%" },
                      ]}
                      onChange={console.log}
                      size={"xs"}
                      boxShadow={'none'}
                    />
                  </HStack>
                </Td>

                <Td borderBottom={0}>
                  <HStack gap={4} w={"full"} justifyContent={"center"}>
                    <IconButton
                      aria-label="Delete"
                      colorScheme="red"
                      icon={<FaTrash />}
                      rounded={"full"}
                      size={"sm"}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <br />
      <HStack w={"full"} justifyContent={"flex-end"} mt={4}>
        <Button
          size={"sm"}
          leftIcon={<FaSatelliteDish />}
          rounded={"full"}
          colorScheme="facebook"
        >
          Add New Operator
        </Button>
        <Button
          size={"sm"}
          leftIcon={<FaPlus />}
          rounded={"full"}
          colorScheme="twitter"
        >
          Add New Rule
        </Button>
      </HStack>
    </>
  );
};

export default BillPaySchema;
