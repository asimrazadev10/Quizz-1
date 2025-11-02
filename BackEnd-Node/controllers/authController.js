import User from "../models/User.js";
import { hash as _hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import regEmailTest from "../utils/regEmailTest.js";
import isAlphabetOnly from "../utils/isAlphabetOnly.js";
import charLength from "../utils/charLength.js";
import sanitizeInput from "../utils/sanitizeInput.js";

import { validationResult } from "express-validator";

export async function register(req, res) {
  const resData = {};
  const { username, email, password, name, companyName } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resData.message = "Validation failed";
    resData.errors = errors.array();
    return res.json(resData);
  }
  try {
    let email_get = sanitizeInput(email);
    if (regEmailTest(email_get) === 0) {
      resData.message = "Email is not valid";
      return res.json(resData);
    }

    let name_get = sanitizeInput(name);
    if (isAlphabetOnly(name_get) === 0) {
      resData.message = "Name invalid: Only characters are allowed";
      return res.json(resData);
    } else if (charLength(name_get, 6, 35) === 0) {
      resData.message =
        "Name invalid: Number of characters should be from 6 to 35";
      return res.json(resData);
    }

    let username_get = sanitizeInput(username);
    if (charLength(username_get, 6, 35) === 0) {
      resData.message =
        "Name invalid: Number of characters should be from 6 to 35";
      return res.json(resData);
    }

    const usernameCheck = await User.findOne({ username: username_get });
    if (usernameCheck) {
      resData.message = "Username already exists";
      return res.json(resData);
    }

    let password_get = sanitizeInput(password);

    console.log(
      "from authController.js=> Snatized Input: ",
      username_get,
      email_get,
      name_get,
      password_get
    );

    const hash = await _hash(password, 10);
    const regUser = await User.create({
      username,
      email,
      passwordHash: hash,
      name,
      companyName,
    });

    const payload_data = {
      userId: regUser._id,
      email: email_get,
      username: username_get,
    };

    const token = jwt.sign(payload_data, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    if (regUser) {
      resData.status = 201;
      resData.message = "Registered Successfully.";
      resData.token = token;
    } else {
      resData.status = 400;
      resData.message = "Error for Create/Insert Data";
    }
    return res.json(resData);
  } catch (e) {
    console.error("Error inserting user:", e);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  console.log("User logged in:", u);

  const payload_data = {
    userId: u._id,
    email: u.email,
    username: u.username,
  };

  if (!u) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await compare(password, u.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(payload_data, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.json({ token });
}
