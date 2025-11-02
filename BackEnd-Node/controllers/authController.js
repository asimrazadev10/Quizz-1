import User from "../models/User";
import { hash as _hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;
  const hash = await _hash(password, 10);
  await User.create({ username, email, password: hash });
  res.status(201).json({ message: "User created" });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await compare(password, u.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = sign({ id: u._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
}
