const express = require('express');
const router = express.Router();
const controller = require('../Controllers/historyController');
const middle = require("../Middleware/verifyJWT");

router.use(express.json());
router.use(express.urlencoded({extended: true}))

//======================== Rotas do Usuário ==========================

router.get("/", middle.verifyJWT, controller.get);
router.patch("/", middle.verifyJWT, controller.patch);

module.exports = router;