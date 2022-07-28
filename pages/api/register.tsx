// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import Users from "../../models/userModel";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body;
  const user = await Users.findOne({ email: body.email });
  if (user) {
    res.status(200).json({ message: "Already registered" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(body.password, salt);
  const users = new Users({ email: body.email, password: hashPassword });
  await users.save();
  res.status(200).json({ message: "Registered Successfully" });
}
