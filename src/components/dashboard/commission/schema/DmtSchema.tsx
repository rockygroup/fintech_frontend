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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import SelectRole from "../../misc/select/SelectRole";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API } from "@/lib/api";
import Loader from "@/components/global/Loader";

interface CommissionSchemaProps {
  packageId: string | number;
}

const DmtSchema = ({ packageId }: CommissionSchemaProps) => {
  const service = "dmt";
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const Toast = useToast();

  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("");
  const [data, setData] = useState([
    {
      plan_id: packageId,
      role_id: role,
      from: "",
      to: "",
      commission: "",
      is_flat: false,
      fixed_charge: "",
      fixed_charge_flat: false,
    },
  ]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData();
      return
    }
    if(role){
      fetchData()
    }
  }, [role]);

  async function fetchData() {
    try {
      setIsLoading(true)
      setData([])
      const res = await API.adminGetCommission(packageId, role, service);
      setData(res?.data);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleError({
        title: "Error whil fetching commission",
        error: error,
      });
    }
  }

  async function createCommission() {
    try {
      await API.adminCreateCommission({
        plan_id: packageId,
        role_id: role,
        service: service,
        from: 1,
        to: 500,
        commission: 0,
        is_flat: 1,
        fixed_charge: 0,
        fixed_charge_flat: 1,
      });
      Toast({
        status: "success",
        title: "Commission added successfully!",
        description: "You can edit it now",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error whil updating commission",
        error: error,
      });
    }
  }

  async function updateCommission(id: string | number, data: object) {
    try {
      await API.adminUpdateCommission(id, service, data);
      Toast({
        status: "success",
        description: "Commission data updated successfully!",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error whil updating commission",
        error: error,
      });
    }
  }

  async function deleteCommission(id: string | number) {
    try {
      await API.adminDeleteCommission(id, service);
      Toast({
        status: "success",
        description: "Commission data deleted successfully!",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error whil deleting commission",
        error: error,
      });
    }
  }

  return (
    <>
    {
      isLoading ? <Loader text={'Loading Data'} /> : null
    }
      <HStack my={6} w={"full"} justifyContent={"flex-start"}>
        <SelectRole
          onChange={(e) => setRole(e.target.value)}
          value={role}
          placeholder="Select Role"
          showAdmin={false}
          variant="none"
        />
      </HStack>
      {role ? (
        <>
          <TableContainer maxH={"sm"} overflowY={"scroll"}>
            <Table size={"md"} variant={"striped"}>
              <Thead>
                <Tr color={"gray.600"}>
                  <Th>From (₹)</Th>
                  <Th>To (₹)</Th>
                  <Th>Commission</Th>
                  <Th>Service Charge</Th>
                  <Th textAlign={"center"}>Action</Th>
                </Tr>
              </Thead>
              <Tbody fontSize={"xs"}>
                {data?.map((item: any, key) => (
                  <Tr key={key}>
                    <Td>
                      <CustomEditableInput defaultValue={item?.from} onSubmit={value => updateCommission(item?.id, {from: value})} />
                    </Td>
                    <Td>
                      <CustomEditableInput defaultValue={item?.to} onSubmit={value => updateCommission(item?.id, {to: value})} />
                    </Td>
                    <Td>
                      <HStack gap={4} w={"full"} justifyContent={"center"}>
                        <CustomEditableInput
                          width={"80%"}
                          defaultValue={item?.commission}
                          onSubmit={value => updateCommission(item?.id, {commission: value})}
                        />
                        <CustomTabs
                          defaultValue={item?.is_flat ? "flat" : "percent"}
                          tabList={[
                            { id: "flat", label: "₹" },
                            { id: "percent", label: "%" },
                          ]}
                          onChange={value => updateCommission(item?.id, {is_flat: value == "flat" ? 1 : 0})}
                          size={"xs"}
                          boxShadow={"none"}
                        />
                      </HStack>
                    </Td>

                    <Td>
                      <HStack w={"full"} justifyContent={"center"}>
                        <CustomEditableInput
                          width={"50%"}
                          defaultValue={item?.fixed_charge}
                          onSubmit={value => updateCommission(item?.id, {fixed_charge: value})}
                        />
                        <CustomTabs
                          defaultValue={
                            item?.fixed_charge_flat ? "flat" : "percent"
                          }
                          tabList={[
                            { id: "flat", label: "₹" },
                            { id: "percent", label: "%" },
                          ]}
                          onChange={value => updateCommission(item?.id, {fixed_charge_flat: value == "flat" ? 1 : 0})}
                          size={"xs"}
                          boxShadow={"none"}
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
                          onClick={() => deleteCommission(item?.id)}
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
              leftIcon={<FaPlus />}
              rounded={"full"}
              colorScheme="twitter"
              onClick={() => createCommission()}
            >
              Add New Rule
            </Button>
          </HStack>
        </>
      ) : null}
    </>
  );
};

export default DmtSchema;
