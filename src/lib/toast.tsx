import React from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
import parse from "html-react-parser";
import {
  CloudCheck,
  AlertCircle,
  BadgeInfo,
  TriangleAlert,
} from "lucide-react";

const formatMessage = (message: string | React.ReactNode): React.ReactNode => {
  if (typeof message === "string") {
    return parse(message);
  }
  return message;
};

export const toast = {
  ...sonnerToast,
  // Overwrites
  success: (message: string | React.ReactNode, data?: ExternalToast) => {
    return sonnerToast.success(formatMessage(message), {
      icon: <CloudCheck className="size-5 " />,
      ...data,
    });
  },

  error: (message: string | React.ReactNode, data?: ExternalToast) => {
    return sonnerToast.error(formatMessage(message), {
      icon: <AlertCircle className="size-5 " />,
      ...data,
    });
  },

  info: (message: string | React.ReactNode, data?: ExternalToast) => {
    return sonnerToast.info(formatMessage(message), {
      icon: <BadgeInfo className="size-5 " />,
      ...data,
    });
  },

  warning: (message: string | React.ReactNode, data?: ExternalToast) => {
    return sonnerToast.warning(formatMessage(message), {
      icon: <TriangleAlert className="size-5 " />,
      ...data,
    });
  },
};
