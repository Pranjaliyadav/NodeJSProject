
const express = require('express');

const router = express.Router();

require('dotenv').config();
const authController = require('../controllers/auth')

const { check } = require('express-validator')

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup', authController.getSignup)
router.post('/signup',check('email')
.isEmail()
.withMessage('Please enter a valid email')
.custom((value, {req})=>{
    if(value === process.env.SENDER_EMAIL){
        throw new Error('This email address is forbidden')
    }
    return true
})
, authController.postSignup)
router.get('/reset', authController.getPasswordReset)
router.post('/reset', authController.postPasswordReset)
router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router