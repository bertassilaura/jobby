const express = require('express');
const router = express.Router();

router.use(express.static(process.cwd() + '/src/Pages'));

router.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/src/Pages/home.html');
});


module.exports = router;