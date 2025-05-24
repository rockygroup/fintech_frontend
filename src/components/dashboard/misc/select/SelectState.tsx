"use client";
import React from "react";
import { Select } from "chakra-react-select";
import { STATES } from "@/lib/utils/constants";

interface StateProps {
  label: string;
  value: string;
}

interface SelectStateProps {
  value: string;
  onChange: (value: string) => void;
}

const SelectState = ({ value, onChange }: SelectStateProps) => {
  return (
    <>
      <Select
        value={STATES?.find((item) => item?.value == value)}
        onChange={(data: StateProps) => onChange(data?.value)}
        options={STATES}
        placeholder={"Select State"}
      />
    </>
  );
};

export default SelectState;
