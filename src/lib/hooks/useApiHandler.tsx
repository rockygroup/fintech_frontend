"use client";
import React, { useEffect, useState } from "react";
import BackendAxios, { FormAxios } from "@/lib/utils/axios";
import { useToast } from "@chakra-ui/react";
import fileDownload from "js-file-download";

interface UploadMediaProps {
  file?: File;
  type?: string;
  userId?: string;
}

interface DownloadMediaProps {
  url: string;
  filename?: string;
}

const useApiHandler = () => {
  const Toast = useToast();

  const adminUploadMedia = async ({ file, type, userId }: UploadMediaProps) => {
    await FormAxios.post(`/admin/manage-user/document/${userId}`, {
      file: file,
      document_type: type,
    })
      .then((res) => {
        return true;
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: `Could not upload ${type}`,
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  const userUploadMedia = async ({ file, type }: UploadMediaProps) => {
    await FormAxios.post(`/user/document`, {
      file: file,
      document_type: type,
    })
      .then((res) => {
        return true;
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: `Could not upload ${type}`,
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  const adminDownloadMedia = async ({ url, filename }: DownloadMediaProps) => {
    BackendAxios.get(`/admin/document?path=${url}`, {
      responseType: "blob",
    })
      .then((res) => {
        fileDownload(res.data, `${filename}`);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: `Could not download`,
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  return {
    adminUploadMedia,
    userUploadMedia,
    adminDownloadMedia,
  };
};

export default useApiHandler;
