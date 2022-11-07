// login
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    // check user from db
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(400).json("Wrong credentials");
    }

    // check password
    const vaildated = await bcrypt.compare(req.body.password, user.password);
    if (!vaildated) {
      return res.status(400).json("Wrong credentials");
    }
    // check wrong -> crash ?
    const { password, ...others } = user._doc;
    res.status(201).json(others);
  } catch (err) {
    res.status(501).json(err);
  }
});
