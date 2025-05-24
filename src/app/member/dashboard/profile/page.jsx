"use client";
import PasswordUpdateForm from "@/components/dashboard/profile/PasswordUpdateForm";
import PinUpdateForm from "@/components/dashboard/profile/PinUpdateForm";
import BusinessDetailsForm from "@/components/dashboard/profile/BusinessDetailsForm";
import Loader from "@/components/global/Loader";
import FileDropzone from "@/components/misc/FileDropzone";
import { API } from "@/lib/api";
import useApiHandler from "@/lib/hooks/useApiHandler";
import useAuth from "@/lib/hooks/useAuth";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
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
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import PanVerificationInput from "@/components/dashboard/profile/PanVerificationInput";

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

const page = () => {
  const ref = useRef(true);
  const Toast = useToast();
  const { handleError } = useErrorHandler();
  const { userUploadMedia } = useApiHandler();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panCard, setPanCard] = useState(null);

  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchInfo();
    }
  }, []);

  async function fetchInfo() {
    try {
      setIsLoading(true);
      const res = await API.me();
      setUser(res?.user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        error: error,
        title: "Error while fetching your info",
      });
    }
  }

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
    setIsLoading(true);
    try {
      if (aadhaarFront) {
        await userUploadMedia({
          file: aadhaarFront,
          type: "aadhaar_front",
        });
      }
      if (aadhaarBack) {
        await userUploadMedia({
          file: aadhaarBack,
          type: "aadhaar_back",
        });
      }
      if (panCard) {
        await userUploadMedia({
          file: panCard,
          type: "pan",
        });
      }
      if (avatar) {
        await userUploadMedia({
          file: avatar,
          type: "avatar",
        });
      }
      await API.updateMe(values);
      setIsLoading(false);
      Toast({
        status: "success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't submit your details", error: error });
    }
  }

  return (
    <>
      {isLoading ? <Loader /> : null}

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Update Your Profile
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <input
          type="file"
          ref={avatarInputRef}
          onChange={handleFileChange}
          accept="image/*"
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
        {user ? (
          <Formik
            initialValues={{
              first_name: user?.first_name,
              middle_name: user?.middle_name,
              last_name: user?.last_name,
              phone_number: user?.phone_number,
              aadhaar_number: user?.aadhaar_number,
              pan_number: user?.pan_number,
              pan: user?.pan,
              date_of_birth: user?.date_of_birth,
            }}
            onSubmit={(values) => console.log(values)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                <FormSubheading title={"Basic Details"} />
                <Stack
                  w={"full"}
                  direction={["column", "row"]}
                  gap={8}
                  mb={8}
                  mt={4}
                  flexWrap={"wrap"}
                >
                  <FormControl w={["full", "xs"]} variant={"floating"} isRequired>
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

                  <FormControl w={["full", "xs"]} variant={"floating"} isRequired>
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
                      isDisabled
                      value={user?.email}
                    />
                    <FormLabel>Email</FormLabel>
                  </FormControl>

                  <FormControl w={["full", "xs"]} variant={"floating"} isRequired>
                    <Input
                      name="phone_number"
                      type="tel"
                      maxLength={10}
                      onChange={handleChange}
                      value={values?.phone_number}
                      placeholder=" "
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
                      isDisabled={Boolean(values?.aadhaar_number)}
                    />
                    <FormLabel>Aadhaar No.</FormLabel>
                  </FormControl>
                  <PanVerificationInput
                    onSuccess={(data) => setFieldValue("pan_number", data)}
                    value={values?.pan_number}
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

                <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                  <Button
                    bgColor={"brand.primary"}
                    _hover={{
                      bgColor: "brand.hover",
                    }}
                    color={"#FFF"}
                    isLoading={isLoading}
                    onClick={() => handleFormSubmit(values)}
                  >
                    Save
                  </Button>
                </HStack>
              </Form>
            )}
          </Formik>
        ) : null}
      </Box>

      <br />
      <BusinessDetailsForm />

      <br />
      <PinUpdateForm />

      <br />
      <PasswordUpdateForm />
    </>
  );
};

export default page;
