"use client";
import { Editable, EditableInput, EditablePreview, InputProps } from "@chakra-ui/react";
import React, { FC } from "react";

interface CustomEditableInputProps {
  defaultValue?: string;
  onSubmit?: (value: any) => void;
  onChange?: (value: string) => void;
  width?: InputProps['width']
}

const CustomEditableInput: FC<CustomEditableInputProps> = ({
  defaultValue,
  onSubmit,
  onChange,
  width
}) => {
  return (
    <>
      <Editable defaultValue={defaultValue} w={width || 'auto'} onSubmit={onSubmit}>
        <EditablePreview w={'full'} />
        <EditableInput />
      </Editable>
    </>
  );
};

export default CustomEditableInput;
