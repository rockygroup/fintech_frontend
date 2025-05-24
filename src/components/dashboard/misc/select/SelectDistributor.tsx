"use client";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { FormControl, FormLabel, Select, SelectProps } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

interface SelectDistributorProps {
  placeholder?: string;
  onChange: SelectProps["onChange"];
  name?: SelectProps["name"];
  variant?: "floating" | "none";
  value?: string | number;
}

const SelectDistributor = ({
  placeholder,
  onChange,
  name,
  variant,
  value,
}: SelectDistributorProps) => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  async function fetchData() {
    try {
      const res = await API.adminGetUsers({role:"distributor"});
      setData(res.data);
    } catch (error) {
      handleError({
        title: "Could not get plans",
        error: error,
      });
    }
  }

  return (
    <>
      <FormControl maxW={["full", "xs"]} variant={variant || "floating"}>
        {variant == "none" ? <FormLabel>Select Distributor</FormLabel> : null}
        <Select
          name={name}
          placeholder={placeholder || "Please select"}
          value={value}
          onChange={onChange}
        >
          {data?.map((item: any, key: number) => (
            <option value={item?.id} key={key}>
              {item?.name}
            </option>
          ))}
        </Select>
        {variant == "floating" ? <FormLabel>Select Distributor</FormLabel> : null}
      </FormControl>
    </>
  );
};

export default SelectDistributor;
