"use client";
import PasswordUpdateForm from "@/components/dashboard/profile/PasswordUpdateForm";
import PinUpdateForm from "@/components/dashboard/profile/PinUpdateForm";
import FileDropzone from "@/components/misc/FileDropzone";
import { API } from "@/lib/api";
import useApiHandler from "@/lib/hooks/useApiHandler";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API_BASE_URL } from "@/lib/utils/constants";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
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
  const ref = useRef(true)
  const Toast = useToast();
  const { handleError } = useErrorHandler();
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

  useEffect(() => {
    if(ref.current){
      ref.current = false
      fetchInfo();
    }
  }, []);

  async function fetchInfo() {
    try {
      const res = await API.me();
      setUser(res?.user);
    } catch (error) {
      handleError({
        error: error,
        title: "Error while fetching your info",
      });
    }
  }

  async function handleFormSubmit(data) {
    setIsLoading(true);
    if (avatar) {
      await adminUploadMedia({
        file: avatar,
        type: "avatar",
        userId: user?.id,
      });
    }
    try {
      await API.updateMe(data);
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
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Update Your Profile
      </Heading>
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
            }}
            onSubmit={(values) => handleFormSubmit(values)}
          >
            {({ values, handleChange, handleSubmit, errors }) => (
              <Form onSubmit={handleSubmit}>
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
                      value={values.first_name}
                      onChange={handleChange}
                    />
                    <FormLabel>First Name</FormLabel>
                  </FormControl>
                  <FormControl w={["full", "xs"]} variant={"floating"}>
                    <Input
                      name="middle_name"
                      type="text"
                      placeholder=" "
                      value={values.middle_name}
                      onChange={handleChange}
                    />
                    <FormLabel>Middle Name</FormLabel>
                  </FormControl>
                  <FormControl w={["full", "xs"]} variant={"floating"}>
                    <Input
                      name="last_name"
                      type="text"
                      placeholder=" "
                      value={values.last_name}
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
                      name="email"
                      type="email"
                      placeholder=" "
                      value={user?.email}
                      isDisabled={true}
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
        ) : null}
      </Box>

      <br />
      <PinUpdateForm />

      <br />
      <PasswordUpdateForm />
    </>
  );
};

export default page;
