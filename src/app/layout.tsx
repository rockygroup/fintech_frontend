"use client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./globals.css";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { useEffect, useRef } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();

  const activeLabelStyles = {
    transform: "scale(0.85) translateY(-24px)",
  };
  const colors = {
    brand: {
      primary: "#48BB78",
      hover: "#38A169",
    },
  };

  const theme = extendTheme({
    components: {
      Form: {
        variants: {
          floating: {
            container: {
              _focusWithin: {
                label: {
                  ...activeLabelStyles,
                },
              },
              "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                {
                  ...activeLabelStyles,
                },
              label: {
                top: 0,
                left: 0,
                zIndex: 2,
                position: "absolute",
                backgroundColor: "white",
                pointerEvents: "none",
                mx: 3,
                px: 1,
                my: 2,
                transformOrigin: "left top",
              },
            },
          },
        },
      },
    },
    colors,
  });

  useEffect(() => {
    if (ref.current) {
      ref.current = false;

      getSettings();
    }
  }, []);

  async function getSettings() {
    try {
      let services: {
        name: string;
        provider: string;
        status: boolean;
        id: number | string;
        limit: string | number;
      }[] = [];
      const res = await API.getServices();

      if (res.data?.length) {
        res.data?.forEach((item: any) => {
          services.push({
            name: item?.name,
            status: Boolean(item?.active),
            provider: item?.provider,
            id: item?.id,
            limit: item?.limit,
          });
        });
      }

      localStorage.setItem("services", JSON.stringify(services));
    } catch (error) {
      handleError({
        title: "Error while getting settings",
        error: error,
      });
    }
  }

  return (
    <html lang="en">
      <head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </head>
      <body>
        <ChakraProvider
          theme={theme}
          toastOptions={{ defaultOptions: { position: "top" } }}
        >
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
