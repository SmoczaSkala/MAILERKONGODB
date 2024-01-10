const Users = require("./../../models/users");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
  const credentials = req.body;
  const { email, password } = credentials;

  try {
    const cfg = { email, password };
    const user = await Users.findOne(cfg);

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        "mailer123"
      );

      return res.status(200).json({ success: true, token });
    }

    return res.status(200).json({ success: false });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const adminLogin = async (req, res) => {
  const credentials = req.body;
  const { email, password } = credentials;

  try {
    const cfg = { email, password };
    const user = await Users.findOne(cfg);

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          admin: user.admin,
        },
        "mailer123"
      );

      sessionStorage.setItem("token", token);

      return res.status(200).json({ success: true, token });
    }

    return res.status(200).json({ success: false });
  } catch (error) {
    return res.status(500).json({ success: true });
  }
};

module.exports = {
  adminLogin,
  userLogin,
};
