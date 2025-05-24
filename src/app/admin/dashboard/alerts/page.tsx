"use client";
import { Box, BoxProps, Button, FormControl, FormLabel, HStack, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";

interface FormSubheadingProps {
  title: string;
  mt?: BoxProps["mt"];
  mb?: BoxProps["mb"];
}

const FormSubheading = ({ title, mt, mb }: FormSubheadingProps) => {
  return (
    <Text
      fontSize={"sm"}
      fontWeight={"medium"}
      color={"gray.700"}
      mt={mt ?? 16}
      mb={mb ?? 8}
      textTransform={"capitalize"}
    >
      {title}
    </Text>
  );
};

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: any) {
    try {
      setIsLoading(true);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Manage Alerts
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            broadcast_message: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <FormSubheading title="Send Broadcast Message" mt={0} />
              <Stack
                w={"full"}
                direction={["column", "row"]}
                gap={8}
                mb={8}
                flexWrap={"wrap"}
              >
                <FormControl w={["full", "full"]} variant={"floating"}>
                  <Input
                    name="broadcast_message"
                    type="text"
                    placeholder=" "
                  />
                  <FormLabel>Global Broadcast Message</FormLabel>
                </FormControl>
              </Stack>

              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={4}>
                <Button
                  bgColor={"brand.primary"}
                  _hover={{
                    bgColor: "brand.hover",
                  }}
                  color={"#FFF"}
                  isLoading={isLoading}
                  type="submit"
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
