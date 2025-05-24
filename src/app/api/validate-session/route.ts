import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse as res } from "next/server";

export function GET(req: NextApiRequest) {
  // Access cookies from the request
  const secureCookie = req.cookies.get("token");

  if (secureCookie) {
    return res.json(
      {
        ok: true,
        message: "Valid session",
      },
      {
        status: 200,
      }
    );
  } else {
    return res.json(
      {
        ok: false,
        message: "Unauthenticated session",
      },
      {
        status: 401,
      }
    );
  }
}