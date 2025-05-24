"use client";
import BackendAxios from "@/lib/utils/axios";
import {
  Button,
  HStack,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import fileDownload from "js-file-download";
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";

interface ExportProps {
  service: "payouts" | "ledger" | "wallet-transfers" | "fund-transfers" | "fund-requests" | "users";
  fileName: string;
  query?: object;
  body?: object;
}

const ExportButtons = ({ service, query, body, fileName }: ExportProps) => {
  const Toast = useToast({ position: "top-right" });
  const [isLoading, setIsLoading] = useState(false);

  function handleExport(extension: string) {
    setIsLoading(true);
    BackendAxios.post(
      `/${
        localStorage.getItem("role") == "admin" ? "admin" : "user"
      }/report/export?report=${service}&format=${extension}&${
        query
          ? Object.keys(query)
              .map(
                (key) =>
                  // @ts-ignore
                  encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
              )
              .join("&")
          : ""
      }`,
      { ...body, extension: extension },
      { responseType: "blob" }
    )
      .then((res) => {
        fileDownload(res.data, `${fileName}.${extension}`);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        Toast({
          status: "error",
          title: "Err while downloading file",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <HStack justifyContent={"flex-start"} gap={4}>
        <Tooltip label={"Excel Export"} placement="top">
          <Button
            size={"sm"}
            variant={"ghost"}
            colorScheme="whatsapp"
            aria-label="Excel"
            leftIcon={<SiMicrosoftexcel />}
            bgColor={"gray.50"}
            rounded={"full"}
            onClick={() => handleExport("xlsx")}
            isLoading={isLoading}
          >
            Excel
          </Button>
        </Tooltip>

        <Tooltip label={"PDF Export"} placement="top">
          <Button
            size={"sm"}
            variant={"ghost"}
            colorScheme="red"
            aria-label="Excel"
            leftIcon={<FaFilePdf />}
            bgColor={"gray.50"}
            rounded={"full"}
            onClick={() => handleExport("pdf")}
            isLoading={isLoading}
          >
            PDF
          </Button>
        </Tooltip>
      </HStack>
    </>
  );
};

export default ExportButtons;
