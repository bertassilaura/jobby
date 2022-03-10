const express = require('express');
const router = express.Router();
const controller = require('../controllers/historyController');

router.use(express.json());
router.use(express.urlencoded({extended: true}))

//======================== Rotas do Usuário ==========================

router.get("/", controller.get);
router.patch("/", controller.patch);

module.exports = router;