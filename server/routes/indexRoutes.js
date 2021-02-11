const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const multer = require('multer');

// создаем стор для аватарок
const storage = multer.diskStorage({
  
  destination: './public/uploads/',
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

// загружаем аватарки
const upload = multer({ storage: storage })


router.get("/", (req, res) => {
  res.send("Server");
});

router.post("/edit", upload.single('avatar'), async (req, res) => {
  const { name, info, phone, fav_games, userId } = req.body;
  const userr = await User.findById(userId)
  console.log(userr);
  req.session.user = { ...req.session.user, name, userId, fav_games, avatar: req.file.filename };
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name,
        information: info,
        phone,
        fav_games,
        avatar: req.file.filename
      },
    },
    { new: true }
  );
  console.log(userr);

  console.log('========> user',user);
  res.json(user);
});

module.exports = router;
