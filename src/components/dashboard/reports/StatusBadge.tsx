import { Badge } from "@chakra-ui/react";
import React from "react";

interface StatusBadgeProps {
  status: "pending" | "success" | "failed";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <>
      <Badge
        colorScheme={
          status == "pending"
            ? "twitter"
            : status == "success"
            ? "whatsapp"
            : status == "failed"
            ? "red"
            : "gray"
        }
        textTransform={'uppercase'}
      >{status}</Badge>
    </>
  );
};

export default StatusBadge;
