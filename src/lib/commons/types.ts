export interface ReceiptProps {
  type:
    | "payout"
    | "cw"
    | "ms"
    | "be"
    | "bbps"
    | "cms"
    | "dmt"
    | "lic"
    | "matm"
    | "wallet-transfer"
    | "fund-transfer";
  transaction_id: string;
  amount: number;
  hideLogo?: boolean;
  hideFooter?: boolean;
  footerMessage?: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  miscData?: object;
}
