import User from "../models/User";

exports.getMe = async (req, res) => {
  const u = await User.findById(req.userId).select("-password");
  res.json(u);
};

exports.getUserByUsername = async (req, res) => {
  const u = await User.findOne({ username: req.params.username }).select(
    "-password"
  );
  if (!u) return res.status(404).json({ message: "Not found" });
  const isMe = u._id.toString() === req.userId;
  res.json({
    user: { ...u, isMe },
  });
};

exports.getAllUsers = async (req,res) => {
  
}

exports.updateUser = async (req, res) => {
  const data = { ...req.body };
  const u = await User.findByIdAndUpdate(req.userId, data, {
    new: true,
  }).select("-password");
  res.json(u);
};

exports.searchUsers = async (req, res) => {
  const q = req.query.q.trim();
  let users = await User.find({ $text: { $search: req.query.q } })
    .limit(20)
    .select("username fname lname");

  if (users.length === 0) {
    const regex = new RegExp(q.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    users = await User.find({ content: regex })
      .limit(20)
      .select("username fname lname");
  }

  res.json(users);
};
