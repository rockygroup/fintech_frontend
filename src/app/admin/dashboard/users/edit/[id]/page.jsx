"use client";
import FileDropzone from "@/components/misc/FileDropzone";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import CustomTabs from "@/components/misc/CustomTabs";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";
import SelectPlan from "@/components/dashboard/misc/select/SelectPlan";
import { API } from "@/lib/api";
import BackendAxios, { FormAxios } from "@/lib/utils/axios";
import Loader from "@/components/global/Loader";
import useApiHandler from "@/lib/hooks/useApiHandler";
import { API_BASE_URL } from "@/lib/utils/constants";
import { FaCheck } from "react-icons/fa";
import SelectRole from "@/components/dashboard/misc/select/SelectRole";
import SelectDistributor from "@/components/dashboard/misc/select/SelectDistributor";
import SelectSuperDistributor from "@/components/dashboard/misc/select/SelectSuperDistributor";
import ManageAdminPermissions from "@/components/dashboard/admin/ManageAdminPermissions";
import ManageMemberPermissions from "@/components/dashboard/admin/ManageMemberPermissions";
import BusinessDetailsForm from "@/components/dashboard/profile/BusinessDetailsForm";

const FormSubheading = ({ title }) => {
  return (
    <Text
      fontSize={"sm"}
      fontWeight={"medium"}
      color={"gray.700"}
      mt={16}
      mb={8}
      textTransform={"capitalize"}
    >
      {title}
    </Text>
  );
};

const page = ({ params }) => {
  const { id } = params;
  const { handleError } = useErrorHandler();
  const { adminUploadMedia } = useApiHandler();
  const ref = useRef(true);
  const avatarInputRef = useRef(null);
  const Toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panCard, setPanCard] = useState(null);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  const handleClick = () => {
    avatarInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Read the selected file as a data URL
      setAvatar(selectedFile);
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the data URL as the image preview
        setAvatarPreview(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await API.adminGetUserInfo(id);
      setUser(res?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't get user details", error: error });
    }
  }

  async function handleFormSubmit(data) {
    try {
      setIsLoading(true);
      if (aadhaarFront) {
        await adminUploadMedia({
          file: aadhaarFront,
          type: "aadhaar_front",
          userId: id,
        });
      }
      if (aadhaarBack) {
        await adminUploadMedia({
          file: aadhaarBack,
          type: "aadhaar_back",
          userId: id,
        });
      }
      if (panCard) {
        await adminUploadMedia({
          file: panCard,
          type: "pan",
          userId: id,
        });
      }
      if (avatar) {
        await adminUploadMedia({
          file: avatar,
          type: "avatar",
          userId: id,
        });
      }
      await API.adminUpdateUser(id, data);
      setIsLoading(false);
      Toast({
        status: "success",
        description: "Details were updated successfully!",
      });
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't submit your details", error: error });
    }
  }

  return (
    <>
      {isLoading ? <Loader /> : null}

      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          Update User Profile
        </Heading>
      </Stack>
      {user?.id ? (
        <>
          <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleFileChange}
              accept="image/"
              style={{ display: "none" }}
            />
            <VStack w={"full"} justifyContent={"center"} mb={4}>
              <Box
                pos={"relative"}
                rounded={"full"}
                boxSize={["24", "36"]}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.50"}
              >
                <Image
                  src={
                    avatarPreview
                      ? avatarPreview
                      : user?.documents?.find(
                          (doc) => doc?.document_type == "avatar"
                        )
                      ? API_BASE_URL.replace("/api", "/") +
                        user?.documents?.find(
                          (doc) => doc?.document_type == "avatar"
                        )?.address
                      : "/avatar.webp"
                  }
                  boxSize={"inherit"}
                  objectFit={"cover"}
                />
                <VStack
                  pos={"absolute"}
                  top={0}
                  left={0}
                  w={"full"}
                  h={"full"}
                  bgColor={"transparent"}
                  color={"transparent"}
                  transition={"all .3s ease"}
                  _hover={{ bgColor: "rgba(0,0,0,0.75)", color: "#FFF" }}
                  justifyContent={"center"}
                  cursor={"pointer"}
                  onClick={handleClick}
                >
                  <BsCamera />
                  <Text fontSize={"xs"}>
                    Click to {user?.avatar ? "Change" : "Upload"}
                  </Text>
                </VStack>
              </Box>
              {avatarPreview ? (
                <Button
                  variant={"ghost"}
                  colorScheme="red"
                  size={"sm"}
                  rounded={"full"}
                  onClick={() => {
                    setAvatarPreview(null);
                    setAvatar(null);
                  }}
                >
                  Remove
                </Button>
              ) : user?.documents?.find(
                  (doc) => doc?.document_type == "avatar"
                ) ? (
                <Text
                  fontSize={"xs"}
                  textAlign={"center"}
                  fontWeight={"medium"}
                >
                  Click on photo to change it
                </Text>
              ) : (
                <Text
                  fontSize={"xs"}
                  textAlign={"center"}
                  fontWeight={"medium"}
                >
                  Please Upload Profile Photo
                </Text>
              )}
            </VStack>
            <Formik
              initialValues={{
                first_name: user?.first_name,
                middle_name: user?.middle_name,
                last_name: user?.last_name,
                email: user?.email,
                phone_number: user?.phone_number,
                aadhaar_number: user?.aadhaar_number,
                pan_number: user?.pan_number,
                capped_balance: user?.capped_balance,
                plan_id: user?.plan_id,
                aadhaar_front: null,
                aadhaar_back: null,
                pan: null,
                date_of_birth: user?.dob,
                role: user?.roles[0]?.name,
              }}
              onSubmit={(values) => handleFormSubmit(values)}
            >
              {({ values, handleChange, handleSubmit, errors }) => (
                <Form onSubmit={handleSubmit}>
                  <FormSubheading title={"Role & Senior"} />
                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <SelectRole
                      variant="floating"
                      name="role"
                      onChange={handleChange}
                      value={values?.role}
                    />

                    {values?.role == 1 ? (
                      <SelectDistributor variant="floating" />
                    ) : values?.role == 2 ? (
                      <SelectSuperDistributor variant="floating" />
                    ) : null}
                  </Stack>

                  <FormSubheading title={"Basic Details"} />
                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="first_name"
                        type="text"
                        placeholder=" "
                        value={values?.first_name}
                        onChange={handleChange}
                      />
                      <FormLabel>First Name</FormLabel>
                    </FormControl>
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="middle_name"
                        type="text"
                        placeholder=" "
                        value={values?.middle_name}
                        onChange={handleChange}
                      />
                      <FormLabel>Middle Name</FormLabel>
                    </FormControl>
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="last_name"
                        type="text"
                        placeholder=" "
                        value={values?.last_name}
                        onChange={handleChange}
                      />
                      <FormLabel>Last Name</FormLabel>
                    </FormControl>
                  </Stack>

                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="date_of_birth"
                        type="date"
                        placeholder=" "
                        value={values?.date_of_birth}
                        onChange={handleChange}
                      />
                      <FormLabel>Date of Birth</FormLabel>
                    </FormControl>
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="email"
                        type="email"
                        placeholder=" "
                        value={values?.email}
                        onChange={handleChange}
                        // isDisabled={true}
                      />
                      <FormLabel>Email</FormLabel>
                    </FormControl>
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="phone_number"
                        type="tel"
                        maxLength={10}
                        placeholder=" "
                        value={values?.phone_number}
                        onChange={handleChange}
                      />
                      <FormLabel>Phone</FormLabel>
                    </FormControl>
                  </Stack>

                  <FormSubheading title={"KYC Details"} />
                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="aadhaar_number"
                        type="text"
                        placeholder=" "
                        value={values?.aadhaar_number}
                        onChange={handleChange}
                        // isDisabled={Boolean(values?.aadhaar_number)}
                      />
                      <FormLabel>Aadhaar No.</FormLabel>
                    </FormControl>
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <Input
                        name="pan_number"
                        type="text"
                        placeholder=" "
                        value={values?.pan_number}
                        onChange={handleChange}
                        // isDisabled={Boolean(values?.pan)}
                      />
                      <FormLabel>PAN</FormLabel>
                    </FormControl>
                  </Stack>

                  <FormSubheading title={"Other Details"} />
                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <FormControl w={["full", "xs"]} variant={"floating"}>
                      <NumberInput
                        name="capped_balance"
                        value={values?.capped_balance}
                      >
                        <NumberInputField
                          min={0}
                          placeholder="₹"
                          name="capped_balance"
                          onChange={handleChange}
                        />
                        <FormLabel>Min. Balance</FormLabel>
                      </NumberInput>
                    </FormControl>

                    <SelectPlan
                      name="plan_id"
                      onChange={handleChange}
                      variant="floating"
                      value={values?.plan_id}
                    />
                  </Stack>

                  <FormSubheading title={"Upload Documents"} />
                  <Stack
                    w={"full"}
                    direction={["column", "row"]}
                    gap={8}
                    mb={8}
                    mt={4}
                  >
                    <Box w={["full", "xs"]}>
                      {user?.documents?.find(
                        (doc) => doc?.document_type == "aadhaar_front"
                      ) ? (
                        <VStack>
                          <Icon
                            as={FaCheck}
                            color={"whatsapp.500"}
                            fontSize={"3xl"}
                          />
                          <Text fontSize={"sm"}>Aadhaar Front Uploaded</Text>
                        </VStack>
                      ) : (
                        <FileDropzone
                          onUpload={(files) => setAadhaarFront(files)}
                          accept="image/*,application/pdf"
                          label="Aadhaar Front"
                          height={32}
                        />
                      )}
                    </Box>
                    <Box w={["full", "xs"]}>
                      {user?.documents?.find(
                        (doc) => doc?.document_type == "aadhaar_back"
                      ) ? (
                        <VStack>
                          <Icon
                            as={FaCheck}
                            color={"whatsapp.500"}
                            fontSize={"3xl"}
                          />
                          <Text fontSize={"sm"}>Aadhaar Back Uploaded</Text>
                        </VStack>
                      ) : (
                        <FileDropzone
                          onUpload={(files) => setAadhaarBack(files)}
                          accept="image/*,application/pdf"
                          label="Aadhaar Back"
                          height={32}
                        />
                      )}
                    </Box>
                    <Box w={["full", "xs"]}>
                      {user?.documents?.find(
                        (doc) => doc?.document_type == "pan"
                      ) ? (
                        <VStack>
                          <Icon
                            as={FaCheck}
                            color={"whatsapp.500"}
                            fontSize={"3xl"}
                          />
                          <Text fontSize={"sm"}>PAN Card Uploaded</Text>
                        </VStack>
                      ) : (
                        <FileDropzone
                          onUpload={(files) => setPanCard(files)}
                          accept="image/*,application/pdf"
                          label="PAN Card"
                          height={32}
                        />
                      )}
                    </Box>
                  </Stack>

                  <HStack
                    w={"full"}
                    justifyContent={"flex-end"}
                    gap={6}
                    mt={16}
                  >
                    <Button
                      bgColor={"brand.primary"}
                      _hover={{
                        bgColor: "brand.hover",
                      }}
                      color={"#FFF"}
                      isLoading={isLoading}
                      onClick={() => handleSubmit(values)}
                    >
                      Save
                    </Button>
                  </HStack>
                </Form>
              )}
            </Formik>
          </Box>

          <br />
          <br />
          <Text mb={8} fontWeight={"semibold"} fontSize={"lg"}>
            Business Details
          </Text>
          <BusinessDetailsForm userId={id} />

          <br />
          <br />
          <Text mb={8} fontWeight={"semibold"} fontSize={"lg"}>
            Permissions
          </Text>
          {user?.roles[0]?.name == "admin" ? (
            <ManageAdminPermissions userId={id} />
          ) : (
            <ManageMemberPermissions
              userId={id}
              isRetailer={user?.roles[0]?.name === "retailer"}
            />
          )}
        </>
      ) : null}
    </>
  );
};

export default page;
