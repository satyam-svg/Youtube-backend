import { Router } from "express";
import { registerUser,loginuser, logoutuser } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middlewares.js';
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
);


router.route("/login").post(loginuser);

//secured routes

router.route("/logout").post(logoutuser)

export default router;
