import User from "../models/User.js";

const getUserByUsername = async (req, res) => {
  const u = await User.findOne({ username: req.params.username }).select(
    "-passwordHash"
  );
  if (!u) return res.status(404).json({ message: "Not found" });
  const isMe = u._id.toString() === req.userId;
  u._doc.isMe = isMe;
  res.json({
    user: u,
  });
};

const updateUser = async (req, res) => {
  const data = { ...req.body };
  const u = await User.findByIdAndUpdate(req.userId, data, {
    new: true,
  }).select("-passwordHash");
  res.json(u);
};

const searchUsers = async (req, res) => {
  const q = req.query.q.trim();
  let users = await User.find({ $text: { $search: req.query.q } })
    .limit(20)
    .select("username name");

  if (users.length === 0) {
    const regex = new RegExp(q.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    users = await User.find({ content: regex })
      .limit(20)
      .select("username name email companyName");
  }

  res.json(users);
};

export default {
  getUserByUsername,
  updateUser,
  searchUsers,
};
