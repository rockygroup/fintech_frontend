"use client";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { FormControl, FormLabel, Select, SelectProps } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

interface SelectRoleProps {
  placeholder?: string;
  onChange: SelectProps["onChange"];
  name?: SelectProps["name"];
  variant?: "floating" | "none";
  value?: string | number;
  showAdmin?: boolean;
}

const SelectRole = ({
  placeholder,
  onChange,
  name,
  variant,
  value,
  showAdmin = true,
}: SelectRoleProps) => {
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
      const res = await API.adminGetAllRoles();
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
        {variant != "floating" ? <FormLabel>Select Role</FormLabel> : null}
        <Select
          name={name}
          placeholder={placeholder || "Please select"}
          value={value}
          onChange={onChange}
          textTransform={"capitalize"}
        >
          {data?.map((item: any, key: number) => {
            if (showAdmin) {
              return (
                <option value={item?.name} key={key}>
                  {item?.name?.replace("_", " ")}
                </option>
              );
            }
            if (!showAdmin && item?.name != "admin") {
              return (
                <option value={item?.name} key={key}>
                  {item?.name?.replace("_", " ")}
                </option>
              );
            }
          })}
        </Select>
        {variant == "floating" ? <FormLabel>Select Role</FormLabel> : null}
      </FormControl>
    </>
  );
};

export default SelectRole;
