const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.use(express.json());
router.use(express.urlencoded({extended: true}))

//======================== Rotas do Usuário ==========================

router.post("/", controller.register);
router.patch("/", controller.patchUser);
router.get("/", controller.get);
router.get("/login", controller.login);
router.delete("/", controller.deleteUser);

router.get("/all", controller.getAll); // Lembre de tirar isso daqui, pelo amor de deus

//======================== Rotas do CustomTimes ==========================

router.post("/customtimes", controller.postCustomTime);
router.patch("/customtimes", controller.patchCustomTime);
router.delete("/customtimes", controller.deleteCustomTime);

//======================== Rotas do Hydration ==========================

router.patch("/hydration", controller.patchHydration)


module.exports = router;
