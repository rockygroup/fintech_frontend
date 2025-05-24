"use client";
import { useDropzone, DropzoneInputProps } from "react-dropzone";
import React, { useState, useEffect, useCallback, FC } from "react";
import {
  Box,
  Icon,
  Text,
  VStack,
  HStack,
  Image,
  Input,
} from "@chakra-ui/react";
import { BsPlusCircle, BsXCircleFill } from "react-icons/bs";

interface FileDropzoneProps {
  onUpload: (file: File[] | File) => void;
  accept?: string | undefined;
  width?: string | number;
  height?: string | number;
  label?: string;
  multiple?: boolean;
}

const FileDropzone: FC<FileDropzoneProps> = ({
  onUpload,
  accept,
  width,
  height,
  label,
  multiple = false,
}) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((imagePreviews) =>
        setSelectedImages((prevImages) => [...imagePreviews])
      )
      .catch((error) => console.error("Error reading file:", error));
  }, []);

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFiles(files?.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: multiple,
  });

  useEffect(() => {
    onUpload(multiple ? files : files[0]);
  }, [files]);

  return (
    <>
      <VStack
        {...getRootProps()}
        w={width ?? "full"}
        h={height ?? "full"}
        rounded={16}
        border={"1px"}
        borderStyle={"dashed"}
        bg={"#FAFAFA"}
        cursor={"pointer"}
        justifyContent={"center"}
      >
        <input
          hidden
          {...(getInputProps() as DropzoneInputProps)}
          accept={accept ?? "image/*"}
          multiple={multiple}
        />
        {isDragActive ? (
          <Text>Drop Your Files Here...</Text>
        ) : (
          <VStack>
            <BsPlusCircle size="32" color="#FF8A65" />
            <Text fontSize={'sm'}>{label ?? "Click to Upload Or Drop Your Files Here..."}</Text>
          </VStack>
        )}
      </VStack>
      <HStack py={4} pos={'relative'} justifyContent={'center'}>
        {selectedImages.map((image, index) => (
          <Box key={index} pos={"relative"}>
            <Icon
              as={BsXCircleFill}
              color={"red"}
              pos={"absolute"}
              size={12}
              top={0}
              right={0}
              onClick={() => removeImage(index)}
              cursor={'pointer'}
              border={'1px solid'}
              rounded={'full'}
              borderColor={'#FFF'}
            />
            <Image src={image} w={24} h={24} rounded={16} objectFit={"cover"} />
          </Box>
        ))}
      </HStack>
    </>
  );
};

export default FileDropzone;
