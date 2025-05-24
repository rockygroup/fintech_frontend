"use client";
import CustomTabs from "@/components/misc/CustomTabs";
import { Heading, Stack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const ref = useRef(true);
  const [provider, setProvider] = useState<string | number | boolean>(
    "paysprint"
  );
  const [availableProviders, setAvailableProviders] = useState<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      const data = JSON.parse(
        localStorage.getItem("services")
      );
      if (data) {
        setAvailableProviders(data);
      }
    }
  }, []);

  return (
    <>
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        mb={8}
      >
        <Heading as={"h1"} fontSize={"xl"}>
          Bill Payment (BBPS)
        </Heading>

        <CustomTabs
          defaultValue={provider}
          tabList={[
            {
              id: "eko",
              label: "eko",
              isDisabled: !availableProviders?.find(
                (item: any) => item?.provider == "eko" && item?.name == "bbps"
              )?.status,
            },
            {
              id: "paysprint",
              label: "paysprint",
              isDisabled: !availableProviders?.find(
                (item: any) =>
                  item?.provider == "paysprint" && item?.name == "bbps"
              )?.status,
            },
          ]}
          onChange={(value) => setProvider(value)}
        />
      </Stack>
    </>
  );
};

export default page;
