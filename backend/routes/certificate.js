const router = require("express").Router();
const {isAuthenticated} = require("../middlewares/isAuthenticated") 
const {getCertificates} = require("../controllers/certificateController"); 

router.get("/", isAuthenticated, getCertificates);

module.exports = router;