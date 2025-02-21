const express=require('express')
const router=express.Router()

const {SaveUserDR,GetUserDR,GetTotalDrParticipants} =require('../controller/DemandResponse/DRParticipation')
const {verifyJWT} =require('../middleware/authMiddleware')

router.post('/post/:location/:user/dr-scheduling',verifyJWT,SaveUserDR)
router.get('/get/:location/:user/dr-scheduling',verifyJWT,GetUserDR)

router.get('/get/:location/dr-participants',verifyJWT,GetTotalDrParticipants)

module.exports=router;