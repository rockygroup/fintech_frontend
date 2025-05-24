"use client";
import SelectRole from "@/components/dashboard/misc/select/SelectRole";
import PasswordUpdateForm from "@/components/dashboard/profile/PasswordUpdateForm";
import PinUpdateForm from "@/components/dashboard/profile/PinUpdateForm";
import CustomTabs from "@/components/misc/CustomTabs";
import FileDropzone from "@/components/misc/FileDropzone";
import { API } from "@/lib/api";
import useApiHandler from "@/lib/hooks/useApiHandler";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
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
import React, { useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";

const FormSubheading = ({ title }) => {
  return (
    <Text
      fontSize={"sm"}
      fontWeight={"medium"}
      color={"gray.700"}
      mt={16}
      mb={4}
      textTransform={"capitalize"}
    >
      {title}
    </Text>
  );
};

const page = () => {
  const { handleError } = useErrorHandler();
  const Toast = useToast();
  const { adminUploadMedia } = useApiHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const avatarInputRef = useRef(null);

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

  async function handleFormSubmit(values) {
    try {
      setIsLoading(true);
      const res = await API.adminCreateUser(values);
      if (avatar) {
        await adminUploadMedia({
          file: avatar,
          type: "avatar",
          userId: res?.data?.id,
        });
      }
      if (values?.aadhaar_front) {
        await adminUploadMedia({
          file: values?.aadhaar_front,
          type: "aadhaar_front",
          userId: res?.data?.id,
        });
      }
      if (values?.aadhaar_back) {
        await adminUploadMedia({
          file: values?.aadhaar_back,
          type: "aadhaar_back",
          userId: res?.data?.id,
        });
      }
      if (values?.pan) {
        await adminUploadMedia({
          file: values?.pan,
          type: "pan",
          userId: res?.data?.id,
        });
      }
      Toast({
        status: "success",
        description: "User was created successfully!",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't submit your details", error: error });
    }
  }

  if (
    process.env.DISABLE_USER_CREATION === "true" ||
    process.env.DISABLE_USER_CREATION === true
  ) {
    return <></>;
  }

  return (
    <>
      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          Create New User
        </Heading>

        <CustomTabs
          tabList={[
            {
              id: "member",
              label: "member",
            },
            {
              id: "distributor",
              label: "distributor",
            },
            {
              id: "super_distributor",
              label: "super distributor",
            },
            {
              id: "admin",
              label: "admin",
            },
          ]}
          onChange={console.log}
          size={"sm"}
        />
      </Stack>

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
              src={avatarPreview ?? user?.avatar ?? "/avatar.webp"}
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
          ) : (
            <Text fontSize={"xs"} textAlign={"center"} fontWeight={"medium"}>
              Please Upload Profile Photo
            </Text>
          )}
        </VStack>
        <Formik
          initialValues={{
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            role: "",
            date_of_birth: "",
            minimum_balance: "",
            aadhaar_front: null,
            aadhaar_back: null,
            pan: null,
          }}
          onSubmit={(values) => handleFormSubmit(values)}
        >
          {({ values, handleChange, setFieldValue, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <FormSubheading title={"Basic Details"} />
              <Stack
                w={"full"}
                direction={["column", "row"]}
                gap={8}
                mb={8}
                mt={4}
              >
                <SelectRole name="role" onChange={handleChange} />
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="first_name"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>First Name</FormLabel>
                </FormControl>
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="middle_name"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Middle Name</FormLabel>
                </FormControl>
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="last_name"
                    type="text"
                    placeholder=" "
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
                <FormControl w={["full", "xs"]} variant={"floating"} isRequired>
                  <Input
                    name="date_of_birth"
                    type="date"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Date of Birth</FormLabel>
                </FormControl>
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="email"
                    type="email"
                    placeholder=" "
                    onChange={handleChange}
                  />
                  <FormLabel>Email</FormLabel>
                </FormControl>
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="phone_number"
                    type="tel"
                    maxLength={10}
                    placeholder=" "
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
                    onChange={handleChange}
                  />
                  <FormLabel>Aadhaar No.</FormLabel>
                </FormControl>
                <FormControl w={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="pan"
                    type="text"
                    placeholder=" "
                    onChange={handleChange}
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
                  <NumberInput name="minimum_balance" onChange={handleChange}>
                    <NumberInputField min={0} placeholder="₹" />
                    <FormLabel>Min. Balance</FormLabel>
                  </NumberInput>
                </FormControl>
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
                  <FileDropzone
                    onUpload={(files) => setFieldValue("aadhaar_front", files)}
                    accept="image/*,application/pdf"
                    label="Aadhaar Front"
                    height={32}
                  />
                </Box>
                <Box w={["full", "xs"]}>
                  <FileDropzone
                    onUpload={(files) => setFieldValue("aadhaar_back", files)}
                    accept="image/*,application/pdf"
                    label="Aadhaar Back"
                    height={32}
                  />
                </Box>
                <Box w={["full", "xs"]}>
                  <FileDropzone
                    onUpload={(files) => setFieldValue("pan", files)}
                    accept="image/*,application/pdf"
                    label="PAN Card"
                    height={32}
                  />
                </Box>
              </Stack>

              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
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
    </>
  );
};

export default page;
