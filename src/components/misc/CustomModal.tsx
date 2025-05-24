"use client";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";

interface CustomModalProps {
  size?: ModalProps["size"];
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (value: any) => void;
  title?: string | ReactNode;
  children: ReactNode;
  hideFooter?: boolean;
  closeOnBlur?: boolean;
  isLoading?: boolean;
  submitText?: string
}

const CustomModal: FC<CustomModalProps> = ({
  size,
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  hideFooter = true,
  closeOnBlur = false,
  isLoading = false,
  submitText
}) => {
  return (
    <>
      <Modal
        size={size ?? "2xl"}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={closeOnBlur}
        closeOnEsc={closeOnBlur}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={"medium"}>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={hideFooter ? 4 : 6}>{children}</ModalBody>
          {hideFooter ? null : (
            <ModalFooter>
              <HStack w={"full"} justifyContent={"flex-end"} gap={4}>
                <Button onClick={onClose} isLoading={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={onSubmit}
                  bgColor={"brand.primary"}
                  _hover={{
                    backgroundColor: "brand.hover",
                  }}
                  color={"#FFF"}
                  isLoading={isLoading}
                >
                  {submitText || "Submit"}
                </Button>
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
