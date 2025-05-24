import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

const CustomButton = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <>
      <Button
        bgColor={props?.variant == "outline" ? "transparent" : "brand.primary"}
        _hover={{ bgColor: "brand.hover", color: "#FFF" }}
        color={props?.variant == "outline" ? "brand.primary" : "#FFF"}
        fontWeight={"medium"}
        border={props?.variant == "outline" ? '1px' : "0"}
        borderColor={props?.variant == "outline" ? 'brand.hover' : "transparent"}
        {...rest}
      >
        {children}
      </Button>
    </>
  );
};

export default CustomButton;
