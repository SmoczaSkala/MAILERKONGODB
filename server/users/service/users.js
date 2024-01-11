const Users = require("./../../models/users");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res) => {
  try {
    const token = jwt.sign({ admin: true /* other claims */ }, "mailer123");

    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token" });
    }

    try {
      const decoded = jwt.verify(token, "mailer123");

      if (!decoded.admin) {
        return res
          .status(200)
          .json({ success: false, message: "Not authorized" });
      }

      const users = await Users.find({}, { email: 1, _id: 0 });

      return res.status(200).json({
        success: true,
        users: users.map((user) => ({ email: user.email })),
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const addUser = async (req, res) => {
  const user = req.body;

  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");

    if (!decoded.admin) {
      return res.status(200).json({ success: false });
    }

    const newUser = await Users.create(user);

    newUser.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  getUsers,
  addUser,
};
