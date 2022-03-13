const express = require('express');
const router = express.Router();
const controller = require('../Controllers/userController');
const middle = require("../Middleware/verifyJWT")

router.use(express.json());
router.use(express.urlencoded({extended: true}))

//======================== Rotas do Usuário ==========================

router.post("/", controller.register);
router.patch("/", middle.verifyJWT, controller.patchUser);
router.get("/", middle.verifyJWT, controller.get);
router.post("/login", controller.login);
router.delete("/", middle.verifyJWT, controller.deleteUser);

router.get("/all", controller.getAll); // Lembre de tirar isso daqui, pelo amor de deus

//======================== Rotas do CustomTimes ==========================

router.post("/customtimes", middle.verifyJWT, controller.postCustomTime);
router.patch("/customtimes", middle.verifyJWT, controller.patchCustomTime);
router.delete("/customtimes", middle.verifyJWT, controller.deleteCustomTime);

//======================== Rotas do Hydration ==========================

router.patch("/hydration", middle.verifyJWT, controller.patchHydration)

module.exports = router;
