"use client";
import CustomButton from "@/components/misc/CustomButton";
import CustomEditableInput from "@/components/misc/CustomEditableInput";
import CustomModal from "@/components/misc/CustomModal";
import DateFormatter from "@/components/misc/DateFormatter";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

interface PackagesProps {
  onEditButtonClick: (id: string | number) => void;
}

const Packages = ({ onEditButtonClick }: PackagesProps) => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const Toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState([]);
  const [newPlanName, setNewPlanName] = useState("");
  const [deleteTargetPlan, setDeleteTargetPlan] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  async function fetchData() {
    try {
      const res = await API.adminGetPlans();
      setData(res.data);
    } catch (error) {
      handleError({
        title: "Error while getting plans",
        error: error,
      });
    }
  }

  async function updatePlan(id: number, data: object) {
    try {
      await API.adminUpdatePlan(id, data);
      Toast({
        status: "success",
        description: "Status updated successfully",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error while getting plans",
        error: error,
      });
    }
  }

  async function deletePlan(id: any) {
    try {
      await API.adminDeletePlan(deleteTargetPlan?.id);
      Toast({
        status: "success",
        description: "Plan updated successfully",
      });
      setDeleteTargetPlan({
        id: "",
        name: "",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error while getting plans",
        error: error,
      });
    }
  }

  async function createPlan() {
    try {
      await API.adminCreatePlan({
        name: newPlanName || "New Plan",
        default: 0,
      });
      onClose();
      Toast({
        status: "success",
        description: "Plan created successfully",
      });
      fetchData();
    } catch (error) {
      handleError({
        title: "Error while creating plan",
        error: error,
      });
    }
  }

  return (
    <>
      <HStack w={"full"} justifyContent={"flex-end"} mb={4}>
        <CustomButton
          size={"sm"}
          rounded={"full"}
          leftIcon={<FaPlus />}
          onClick={onOpen}
        >
          Create New Package
        </CustomButton>
      </HStack>
      <TableContainer maxH={"sm"} overflowY={"scroll"}>
        <Table size={"md"} variant={"striped"}>
          <Thead>
            <Tr color={"gray.600"}>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Is Default</Th>
              <Th>Created By</Th>
              <Th>Created At</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody fontSize={"xs"}>
            {data?.map((item: any, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>
                  <CustomEditableInput
                    defaultValue={item?.name}
                    onSubmit={(value) => updatePlan(item?.id, { name: value })}
                  />
                </Td>
                <Td textAlign={"center"}>
                  <Switch
                    isChecked={Boolean(item?.default)}
                    onChange={(e) => {
                      updatePlan(item?.id, {
                        default: e.target.checked ? 1 : 0,
                      });
                    }}
                  />
                </Td>
                <Td>{item?.user?.name}</Td>

                <Td borderBottom={0}>
                  <DateFormatter>{item?.created_at}</DateFormatter>
                </Td>
                <Td borderBottom={0}>
                  <HStack gap={4} w={"full"} justifyContent={"center"}>
                    <Button
                      colorScheme="twitter"
                      size={"xs"}
                      rounded={"full"}
                      onClick={() => onEditButtonClick(item?.id)}
                    >
                      Edit Commission
                    </Button>
                    <Button
                      colorScheme="red"
                      size={"xs"}
                      rounded={"full"}
                      onClick={() =>
                        setDeleteTargetPlan({ id: item?.id, name: item?.name })
                      }
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={"Create new package"}
        hideFooter={false}
        onSubmit={() => createPlan()}
      >
        <FormControl variant={"floating"}>
          <Input
            name="plan_name"
            onChange={(e) => setNewPlanName(e.target.value)}
            value={newPlanName}
            placeholder=" "
          />
          <FormLabel>Enter plan name</FormLabel>
        </FormControl>
      </CustomModal>

      <CustomModal
        isOpen={Boolean(deleteTargetPlan?.id)}
        onClose={() => setDeleteTargetPlan({ id: "", name: "" })}
        title={`Delete ${deleteTargetPlan?.name}?`}
        hideFooter={false}
        onSubmit={deletePlan}
      >
        <Text>
          Are you sure you want to delete this plan? This action can not be
          reversed.
        </Text>
      </CustomModal>
    </>
  );
};

export default Packages;
