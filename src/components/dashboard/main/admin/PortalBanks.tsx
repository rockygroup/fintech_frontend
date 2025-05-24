"use client";
import CustomModal from "@/components/misc/CustomModal";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const PortalBanks = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      getData();
    }
  }, []);

  async function getData() {
    try {
      const res = await API.adminGetPortalBanks();
      setData(res?.data);
    } catch (error) {
      handleError({ title: "Could not fetch banks", error: error });
    }
  }

  async function addNewBank(values: object) {
    try {
      setIsLoading(true);
      await API.adminAddPortalBank(values);
      onClose();
      setIsLoading(false);
      getData();
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Could not add new bank", error: error });
    }
  }

  async function handleDelete(id: string | number) {
    try {
      await API.adminDeletePortalBank(id);
      getData();
    } catch (error) {
      handleError({ title: "Could not add new bank", error: error });
    }
  }

  async function handleUpdate(id: string | number, data: object) {
    try {
      await API.adminUpdatePortalBank(id, data);
      getData();
    } catch (error) {
      handleError({ title: "Could not add new bank", error: error });
    }
  }

  return (
    <>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <HStack mb={8} justifyContent={"flex-end"}>
          <Button
            bgColor={"brand.primary"}
            _hover={{
              bgColor: "brand.hover",
            }}
            color={"#FFF"}
            onClick={onOpen}
            leftIcon={<FaPlus />}
          >
            Add New Bank
          </Button>
        </HStack>
        <TableContainer maxH={"lg"} overflowY={"scroll"}>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Beneficiary</Th>
                <Th>Account No.</Th>
                <Th>Bank Name</Th>
                <Th>IFSC</Th>
                <Th>UPI ID</Th>
                <Th textAlign={"center"}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item: any, key) => (
                <Tr key={key}>
                  <Td>{item?.id}</Td>
                  <Td>{item?.beneficiary_name}</Td>
                  <Td>{item?.account_number}</Td>
                  <Td>{item?.name}</Td>
                  <Td>{item?.ifsc_code}</Td>
                  <Td>{item?.upi_id}</Td>
                  <Td>
                    <HStack gap={8} justifyContent={"center"}>
                      <Switch
                        isChecked={item?.status === 1}
                        onChange={(e) =>
                          handleUpdate(item?.id, { status: e.target.checked })
                        }
                      />
                      <IconButton
                        rounded={"full"}
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Delete"
                        onClick={() => handleDelete(item?.id)}
                        size={'sm'}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <CustomModal
        title={"Add New Bank"}
        size={"3xl"}
        isOpen={isOpen}
        onClose={onClose}
        hideFooter={true}
      >
        <Formik
          initialValues={{
            name: "",
            beneficiary_name: "",
            account_number: "",
            ifsc_code: "",
            upi_id: ""
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack direction={["column", "row"]} gap={8} flexWrap={"wrap"}>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="name"
                    onChange={handleChange}
                    value={values?.name}
                    placeholder=" "
                  />
                  <FormLabel>Bank Name</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="account_number"
                    onChange={handleChange}
                    value={values?.account_number}
                    placeholder=" "
                  />
                  <FormLabel>Account Number</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="beneficiary_name"
                    onChange={handleChange}
                    value={values?.beneficiary_name}
                    placeholder=" "
                  />
                  <FormLabel>Beneficiary Name</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="ifsc_code"
                    onChange={handleChange}
                    value={values?.ifsc_code}
                    placeholder=" "
                  />
                  <FormLabel>Bank IFSC</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="upi_id"
                    onChange={handleChange}
                    value={values?.upi_id}
                    placeholder=" "
                  />
                  <FormLabel>UPI ID</FormLabel>
                </FormControl>
              </Stack>
              <HStack justifyContent={"flex-end"} mt={8} gap={4}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  color={"#FFF"}
                  bgColor={"brand.primary"}
                  _hover={{
                    bgColor: "brand.hover",
                  }}
                  onClick={() => addNewBank(values)}
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
};

export default PortalBanks;
