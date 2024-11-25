
const express = require('express');

const router = express.Router();

require('dotenv').config();
const authController = require('../controllers/auth')

const { check, body } = require('express-validator')

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup', authController.getSignup)
router.post('/signup',
    //put all validation in array checking keys of your form
    [
        check('email')
.isEmail()
.withMessage('Please enter a valid email')
.custom((value, {req})=>{
    if(value === process.env.SENDER_EMAIL){
        throw new Error('This email address is forbidden')
    }
    return true
}),
body('password',
'Please enter a valid password with at least 6 characters.' //this is default error message
)
.isLength({min : 6}),
body('confirmPassword' )
.custom((value, {req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords does not match')
    }
    return true
})
   
]
, authController.postSignup)
router.get('/reset', authController.getPasswordReset)
router.post('/reset', authController.postPasswordReset)
router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router