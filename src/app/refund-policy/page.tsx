"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import { Box, Heading, Text, Container } from "@chakra-ui/react";

const page = () => {
  // useEffect(() => {
  //   window.location.href = "/auth/xckvnalo"
  // }, [])

  return (
    <>
      <Navbar />
      <Container maxW="container.lg" py={{ base: 6, md: 10 }}>
        <Box>
          <Heading
            as="h1"
            size={{ base: "xl", md: "2xl" }}
            mb={{ base: 3, md: 5 }}
            textAlign={{ base: "center", md: "center" }}
          >
            Refund Policy
          </Heading>
          <Text
            mb={{ base: 3, md: 4 }}
            textColor={"gray"}
            fontSize={{ base: "md", md: "md" }}
            textAlign="justify"
          >
            By accessing and using products/services of {process.env.NEXT_PUBLIC_BRAND_NAME} Private Limited
            (henceforth referred to as “{process.env.NEXT_PUBLIC_BRAND_NAME}”), you accept and agree to the
            terms, conditions and rules without limitation and or qualification.{" "}
            <br />
            <br />
            We reserve the right to modify the terms at any time without giving
            you any prior notice. Your use of {process.env.NEXT_PUBLIC_BRAND_NAME} following any such
            modification constitutes your agreement to follow and be bound by
            the terms as modified. Any additional terms and conditions,
            disclaimers, privacy policies and other policies applicable in
            general and/ or to specific areas of this website, {process.env.NEXT_PUBLIC_BRAND_NAME} or to a
            particular service are also considered as terms. <br />
            <br /> {process.env.NEXT_PUBLIC_BRAND_NAME} does not at any point of time during any transaction
            between the user and merchant/vendor and or service provider take
            the ownership of any of the products/services provided by the
            merchant. Nor does {process.env.NEXT_PUBLIC_BRAND_NAME} at any point asserts any rights or
            claims over the products/services offered by the merchant to the
            user. The cancellation/refund, if any, will be governed as per the
            terms and conditions of the aggregator or of the merchant/vendor.
            {process.env.NEXT_PUBLIC_BRAND_NAME} has no role in governing refund/cancellation charges.
            {process.env.NEXT_PUBLIC_BRAND_NAME}, will not be responsible for refund/cancellation including
            any charges arising therefrom. <br />
            <br /> In the event, you erroneously send a payment to a wrong party
            or have sent a payment for a wrong amount, {process.env.NEXT_PUBLIC_BRAND_NAME} shall have no
            liability in this regard and your only recourse will be to contact
            such third party to whom such payment was sent and seek a refund (if
            any). {process.env.NEXT_PUBLIC_BRAND_NAME} will not refund or reverse a payment erroneously made
            by you. <br />
            <br /> All sales of prepaid recharge on the {process.env.NEXT_PUBLIC_BRAND_NAME} platform are
            final with no refund or exchange permitted. you are responsible for
            the mobile number or the account number for which you purchased the
            prepaid recharge and all charges that result from those purchases.
            You are also responsible for the information relating to data card
            and similar recharge services and all charges that result from those
            purchases. {process.env.NEXT_PUBLIC_BRAND_NAME} is not responsible for any purchase of prepaid
            recharge for an incorrect mobile number or the account number or
            incorrect data card information and or similar services. <br />
            <br /> {process.env.NEXT_PUBLIC_BRAND_NAME} disclaims any accountability, legal, losses/damages
            or else, that might arise because of the act, omission or otherwise
            of any user on its website/mobile application or caused by the same.
            user/you expressly admit that {process.env.NEXT_PUBLIC_BRAND_NAME} is only a payment facilitator
            & intermediary, and as such, stands indemnified from any
            accountability that might arise because of the same. you (user)
            moreover acknowledge that visiting/using {process.env.NEXT_PUBLIC_BRAND_NAME} website/mobile
            application is an implicit reception/confirmation of this disclaimer
            on your part. <br />
            <br /> you are requested to go through the merchant/vendor provided
            terms and conditions on their website and or platform. {process.env.NEXT_PUBLIC_BRAND_NAME} is
            not responsible for your inability to access such terms and
            conditions or for any loss resulting from such terms and conditions
            or lack thereof. you agree and acknowledge that the actual contract
            for sale is directly between you and the merchant/vendor. {process.env.NEXT_PUBLIC_BRAND_NAME}
            does not control or prevent changes in the published details and
            descriptions of websites/apps operated by the aggregator or the
            merchant/vendor and is not responsible for any content therein.
            {process.env.NEXT_PUBLIC_BRAND_NAME} has no control over the existence, quality, safety or
            legality of items displayed; the accuracy of the aggregator’s
            content or listings; the ability of the aggregator and
            merchant/vendor to sell items or provide services. {process.env.NEXT_PUBLIC_BRAND_NAME} does not
            at any point of time during any transaction between you and
            aggregator/merchant/vendor, take the ownership of any of the
            listing, bookings or services offered by the
            aggregator/merchant/vendor. Nor does {process.env.NEXT_PUBLIC_BRAND_NAME} at any point asserts
            any rights or claims over the same offered by the
            aggregator/merchant/vendor to you. The aggregator or the
            merchant/vendor is solely responsible for the
            content/listings/bookings made available by it through the {process.env.NEXT_PUBLIC_BRAND_NAME}
            platform and you should contact the respective aggregator or
            merchant/vendor directly. For more information, we request you to
            contact the vendor/merchant/ service provider in order to get
            further clarifications and confirmation or the same can be confirmed
            on their websites as well. <br />
            <br />
            {process.env.NEXT_PUBLIC_BRAND_NAME} is not responsible for any warranty, guarantee, post-sale
            claims, genuineness of listings/bookings, content, products and
            services. {process.env.NEXT_PUBLIC_BRAND_NAME} will not be liable for any claims including but
            not limited to any misrepresentation by the aggregator or the
            merchant/vendor in its content/listings/bookings. <br />
            <br /> Not withstanding anything contrary contained herein, the
            service, the interface and api work, and their respective
            information, pricing and data, and availability are subject at any
            time and from time to time to human, mechanical, typographic, or
            other errors, oversights, mistakes, limitations, delays, service
            interruptions, including, without limitation, as may be due in whole
            or in part to, related to or arising out of (i) computer hardware
            and software, telecommunication and operating systems, databases, or
            business processes and procedures, other problems inherent in, or
            which may be associated with, the use of the internet and electronic
            communications including, without limitation, force majeure event,
            government / regulatory actions, orders, notifications etc. And / or
            and acts and omissions of third parties etc. <br />
            <br /> Any amount transferred erroneously or for any reason by the
            user shall not be refunded to the user in any circumstances. <br />
            <br /> The user understands and agrees that {process.env.NEXT_PUBLIC_BRAND_NAME} is not a party
            to the contract between the user and the merchant establishment.
            {process.env.NEXT_PUBLIC_BRAND_NAME} does not endorse any advertiser or merchant linked to its
            website. Furthermore, {process.env.NEXT_PUBLIC_BRAND_NAME} is under no obligation to monitor the
            merchant establishment’s service/products used by the user. The
            merchant establishment alone will be responsible for all obligations
            under the contract including (without limitation) warranties or
            guarantees. Any dispute with or complaint against any merchant
            establishment must be directly resolved by the user with the
            merchant establishment. It is clarified that {process.env.NEXT_PUBLIC_BRAND_NAME} shall not be
            responsible or liable for any deficiency in goods and/or services
            purchased using {process.env.NEXT_PUBLIC_BRAND_NAME} wallet. <br />
            <br />
            Any payment made erroneously by the user to any merchant
            establishment or any erroneous transfer to any person shall not be
            refunded to the user by {process.env.NEXT_PUBLIC_BRAND_NAME} in any circumstances. <br />
            <br /> Any web-link on the platform to a third-party site is not an
            endorsement of that web-link. By using or browsing any such other
            web-link, the user shall be subject to the terms and conditions in
            relation to that web-link. <br />
            <br /> In the event of any dispute (defined below), {process.env.NEXT_PUBLIC_BRAND_NAME} records
            shall be binding as the conclusive evidence of the transactions
            carried out through use of the wallet. <br />
            <br />
            {process.env.NEXT_PUBLIC_BRAND_NAME} will not be responsible for recovering the money in case
            the account holder initiates fund transfer to an unintended or
            incorrect account. <br />
            <br /> These following terms and conditions shall be applicable to
            the provision of any fund transfer and fund collection facility
            provided / facilitated by {process.env.NEXT_PUBLIC_BRAND_NAME}. The user shall provide correct
            beneficiary details to {process.env.NEXT_PUBLIC_BRAND_NAME} at the time of availing the said
            facility. The user shall be solely responsible for entering wrong
            beneficiary details like incorrect virtual payment address or
            incorrect mobile number or account no or ifsc code, due to which the
            funds are transferred to an incorrect beneficiary. The user agrees
            that the payment order shall become irrevocable when it is executed
            by {process.env.NEXT_PUBLIC_BRAND_NAME}. <br />
            <br /> The user is responsible for the accuracy and authenticity of
            the instructions provided to {process.env.NEXT_PUBLIC_BRAND_NAME} and the same, if is in the
            form and manner prescribed by {process.env.NEXT_PUBLIC_BRAND_NAME}, shall be considered to be
            sufficient to operate the said facility. {process.env.NEXT_PUBLIC_BRAND_NAME} shall not be
            required to independently verify the instructions. {process.env.NEXT_PUBLIC_BRAND_NAME} has no
            liability if it does not or is unable to stop or prevent the
            implementation of any payment order issued by the user. Once a
            payment order is issued by the user the same cannot be subsequently
            revoked by the user. <br />
            <br /> All instructions, requests, directives, orders, directions,
            entered by the user, are based upon the user’s decisions and are the
            sole responsibility of the user.
          </Text>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default page;
