const express=require('express')
const router=express.Router()

const {UserSignup,OperatorSignup} =require('../controller/Auth/signupController')
const {Login,Logout} = require('../controller/Auth/loginController');
const {verifyJWT} =require('../middleware/authMiddleware')

router.post('/usersignup',UserSignup);
router.post('/operatorsignup',OperatorSignup);
router.post('/login',Login)
router.post('/logout',verifyJWT,Logout)

module.exports=router;