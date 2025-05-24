"use client";
import CustomButton from "@/components/misc/CustomButton";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import $ from "jquery";
import PinModal from "../../misc/PinModal";

interface AepsWithdrawalFormProps {
  provider: string | number | boolean;
  biometricDevice: string;
  isDisabled?: boolean
}

const AepsWithdrawalForm = ({
  provider,
  biometricDevice,
  isDisabled
}: AepsWithdrawalFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Toast = useToast();

  const [formData, setFormData] = useState<any>(null);
  const [pid, setPid] = useState<any>(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  function handleFormSubmit(values: any) {
    setFormData({...values, pid: pid});
    onOpen();
  }

  function captureMantraFingerprint(formValues: any) {
    setIsBtnLoading(true);
    var GetCustomDomName = "127.0.0.1";
    var SuccessFlag = 0;
    var primaryUrl = "http://" + GetCustomDomName + ":";
    var url = "";
    var SuccessFlag = 0;

    var verb = "RDSERVICE";
    var err = "";

    var MethodCapture: any = "/rd/capture";
    var MethodInfo: any = "/rd/info";

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    var data = new Object();
    var obj = new Object();

    $.ajax({
      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + 11100,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,
      success: function (data) {
        var $doc = $.parseXML(data);
        var CmbData1 = $($doc).find("RDService").attr("status");
        var CmbData2 = $($doc).find("RDService").attr("info");
        if (CmbData1 == "READY") {
          SuccessFlag = 1;
          if (RegExp("\\b" + "Mantra" + "\\b").test(CmbData2) == true) {
            if ($($doc).find("Interface").eq(0).attr("path") == "/rd/capture") {
              MethodCapture = $($doc).find("Interface").eq(0).attr("path");
            }
            if ($($doc).find("Interface").eq(1).attr("path") == "/rd/capture") {
              MethodCapture = $($doc).find("Interface").eq(1).attr("path");
            }
            if ($($doc).find("Interface").eq(0).attr("path") == "/rd/info") {
              MethodInfo = $($doc).find("Interface").eq(0).attr("path");
            }
            if ($($doc).find("Interface").eq(1).attr("path") == "/rd/info") {
              MethodInfo = $($doc).find("Interface").eq(1).attr("path");
            }
          }
        } else {
          SuccessFlag = 0;
        }
      },
    });

    if (SuccessFlag == 1) {
      //alert("RDSERVICE Discover Successfully");
      var XML =
        "<" +
        "?" +
        'xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
      var finalUrl = "http://" + GetCustomDomName + ":" + 11100;
      var verb = "CAPTURE";
      var err = "";
      var res;
      $.support.cors = true;
      var httpStaus = false;
      var jsonstr = "";

      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: finalUrl + MethodCapture,
        data: XML,
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: async function (data) {
          var $doc = $.parseXML(data);
          var Message = $($doc).find("Resp").attr("errInfo");
          var errCode = $($doc).find("Resp").attr("errCode");
          var srno = $($doc).find("Param").attr("value");
          var Skey =
            $doc.getElementsByTagName("Skey")[0].childNodes[0].nodeValue;
          var PidData =
            $doc.getElementsByTagName("Data")[0].childNodes[0].nodeValue;
          var PidDatatype = $($doc).find("Data").attr("type");
          var hmac =
            $doc.getElementsByTagName("Hmac")[0].childNodes[0].nodeValue;
          var sessionKey =
            $doc.getElementsByTagName("Skey")[0].childNodes[0].nodeValue;

          var ci = $($doc).find("Skey").attr("ci");
          var mc = $($doc).find("DeviceInfo").attr("mc");
          var mi = $($doc).find("DeviceInfo").attr("mi");
          var dc = $($doc).find("DeviceInfo").attr("dc");
          var rdsVer = $($doc).find("DeviceInfo").attr("rdsVer");
          var rdsID = $($doc).find("DeviceInfo").attr("rdsId");
          var dpID = $($doc).find("DeviceInfo").attr("dpId");
          var qScore = $($doc).find("Resp").attr("qScore");
          var nmPoints = $($doc).find("Resp").attr("nmPoints");
          var pType = 0;
          var pCount = 0;
          var iType = 0;
          var iCount = 0;
          var fType = $($doc).find("Resp").attr("fType");
          var fCount = $($doc).find("Resp").attr("fCount");
          var errInfo = $($doc).find("Resp").attr("errInfo");
          var errCode = $($doc).find("Resp").attr("errCode");

          if (errCode == "0") {
            Toast({
              status: "success",
              description: "Fingerprint Captured",
            });
            setPid(data);
            setIsBtnLoading(false);
            handleFormSubmit(formValues);
          } else {
            alert("Error : " + Message);
          }
        },
      });
    } else {
      Toast({
        status: "error",
        title: "Biometric Device Not Found",
        description: "Please connect your device and try again.",
      });
      setIsBtnLoading(false);
    }
  }

  return (
    <>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Formik
          initialValues={{
            beneficiary_name: "",
            aadhaar_number: "",
            amount: "",
            provider: provider,
          }}
          onSubmit={console.log}
        >
          {({ values, handleChange, handleSubmit, handleReset, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Stack
                direction={["column", "row"]}
                spacing={8}
                flexWrap={"wrap"}
                my={4}
              >
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="beneficiary_name"
                    onChange={handleChange}
                    value={values?.beneficiary_name}
                    placeholder=" "
                  />
                  <FormLabel>Beneficiary Name</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <Input
                    name="aadhaar_number"
                    onChange={handleChange}
                    value={values?.aadhaar_number}
                    placeholder=" "
                  />
                  <FormLabel>Aadhaar No.</FormLabel>
                </FormControl>
                <FormControl maxW={["full", "xs"]} variant={"floating"}>
                  <NumberInput min={50}>
                    <NumberInputField
                      name="amount"
                      onChange={handleChange}
                      value={values?.amount}
                      placeholder="₹"
                    />
                    <FormLabel>Amount (₹)</FormLabel>
                  </NumberInput>
                </FormControl>
              </Stack>

              <HStack w={"full"} justifyContent={"flex-end"} gap={6} mt={16}>
                <CustomButton
                  onClick={() => {
                    if (biometricDevice == "mantra")
                      captureMantraFingerprint(values);
                  }}
                  isLoading={isBtnLoading}
                  isDisabled={isDisabled}
                >
                  Submit
                </CustomButton>
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>

      <PinModal
        type={"cw"}
        isOpen={isOpen}
        onClose={onClose}
        formData={formData}
      />
    </>
  );
};

export default AepsWithdrawalForm;
