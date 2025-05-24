import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const response = NextResponse.json({ message: "Cookie cleared" }); // Optional response body

  response.cookies.set("token", "", { maxAge: 0, secure: true });

  return response;
}
