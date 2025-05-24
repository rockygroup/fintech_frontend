"use client";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { FormControl, FormLabel, Select, SelectProps } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

interface SelectPortalBankProps {
  placeholder?: string;
  onChange: SelectProps["onChange"];
  name?: SelectProps["name"];
}

const SelectPortalBank = ({
  placeholder,
  onChange,
  name,
}: SelectPortalBankProps) => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const banks = JSON.parse(
      localStorage.getItem("banks")
    );
    if (banks?.length) {
      setData(banks);
    } else if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  async function fetchData() {
    try {
      const res = await API.getPortalBanks();
      setData(res.data);
      localStorage.setItem("banks", JSON.stringify(res?.data));
    } catch (error) {
      handleError({
        title: "Could not get portal banks",
        error: error,
      });
    }
  }

  return (
    <>
      <FormControl maxW={["full", "xs"]} variant={"floating"}>
        <Select
          name={name}
          placeholder={placeholder || "Please select"}
          onChange={onChange}
        >
          {data?.map((item: any, key: number) => (
            <option value={item?.id} key={key}>
              ({item?.name}) {item?.beneficiary_name} - {item?.account_number}
            </option>
          ))}
        </Select>
        <FormLabel>Select Bank</FormLabel>
      </FormControl>
    </>
  );
};

export default SelectPortalBank;
