"use client";
import CustomTabs from "@/components/misc/CustomTabs";
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import AepsWithdrawalSchema from "./schema/AepsWithdrawalSchema";
import AepsMiniStatementSchema from "./schema/AepsMiniStatementSchema";
import BillPaySchema from "./schema/BillPaySchema";
import DmtSchema from "./schema/DmtSchema";
import PayoutSchema from "./schema/PayoutSchema";
import LicSchema from "./schema/LicSchema";
import CmsSchema from "./schema/CmsSchema";

interface CommissionSetupProps {
  packageId: string | number;
}

const CommissionSetup = ({ packageId }: CommissionSetupProps) => {
  const [services, setServices] = useState([
    // {
    //   id: "aeps-withdrawal",
    //   label: "AePS Withdrawal",
    // },
    // {
    //   id: "aeps-mini-statement",
    //   label: "AePS Mini Statement",
    // },
    // {
    //   id: "bbps",
    //   label: "Bill Pay",
    // },
    // {
    //   id: "dmt",
    //   label: "DMT",
    // },
    {
      id: "payout",
      label: "Payout",
    },
    // {
    //   id: "lic",
    //   label: "LIC Payment",
    // },
    // {
    //   id: "pan",
    //   label: "PAN Application",
    // },
    // {
    //   id: "cms",
    //   label: "CMS Deposit",
    // },
  ]);


  return (
    <>
      <Box>
        <Tabs>
          <TabList overflowX={'scroll'} className="hide-scrollbar">
            {services?.map((item, key) => (
              <Tab key={key} fontSize={"sm"}>
                {item?.label}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {/* <TabPanel>
              <AepsWithdrawalSchema packageId={packageId} />
            </TabPanel>
            <TabPanel>
              <AepsMiniStatementSchema packageId={packageId} />
            </TabPanel>
            <TabPanel>
              <BillPaySchema />
            </TabPanel>
            <TabPanel>
              <DmtSchema packageId={packageId} />
            </TabPanel> */}
            <TabPanel>
              <PayoutSchema packageId={packageId} />
            </TabPanel>
            {/* <TabPanel>
              <LicSchema />
            </TabPanel>
            <TabPanel>
              <p>PAN WIP</p>
            </TabPanel>
            <TabPanel>
              <CmsSchema packageId={packageId} />
            </TabPanel> */}
          </TabPanels>
        </Tabs>
        <br />
        <br />
      </Box>
    </>
  );
};

export default CommissionSetup;
