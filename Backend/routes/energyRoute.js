const express=require('express')
const router=express.Router()
const multer=require('multer')


const{SaveSolarActualEnergy,SaveSolarPredictedEnergy,GetSolarActualEnergy,GetSolarPredictedEnergy} =require('../controller/Energy/solarGeneration')
const{SaveWindActualEnergy,SaveWindPredictedEnergy,GetWindActualEnergy,GetWindPredictedEnergy} =require('../controller/Energy/windGeneration')
const{SaveLoadEnergy, GetLoadEnergy} =require('../controller/Energy/loadValue')
const {verifyJWT} =require('../middleware/authMiddleware')

const upload = multer({ dest: 'uploads/' });


//Solar energy generation
router.post('/post/:location/solar/actual',upload.single('file'),SaveSolarActualEnergy);
router.post('/post/:location/solar/predicted',upload.single('file'),SaveSolarPredictedEnergy);

router.get('/get/:location/solar/actual',verifyJWT,GetSolarActualEnergy);
router.get('/get/:location/solar/predicted',verifyJWT,GetSolarPredictedEnergy);

//Wind energy generation
router.post('/post/:location/wind/actual',upload.single('file'),SaveWindActualEnergy);
router.post('/post/:location/wind/predicted',upload.single('file'),SaveWindPredictedEnergy);

router.get('/get/:location/wind/actual',verifyJWT,GetWindActualEnergy);
router.get('/get/:location/wind/predicted',verifyJWT,GetWindPredictedEnergy);


//Load energy
router.post('/post/:location/load',upload.single('file'),SaveLoadEnergy);

router.get('/get/:location/load',verifyJWT,GetLoadEnergy);



module.exports=router;