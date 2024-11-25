
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto') //for creating token
require('dotenv').config(); //so you can use env variables, otherwise will get undefined
const {validationResult} = require('express-validator') //gives error that check throws
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport');

// we can use this to send email
const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
        api_key : process.env.SEND_MAIL_API_KEY

    }
}))

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null
    }
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login', isAuthenticated: false,
        errorMessage : message,
        oldInput : {
            email : "",
            password : "",
        },
        validationErrors : []
     });


};


exports.postLogin = (req, res, next) => {

    const email = req.body.email
    const password = req.body.password
    const validationError = validationResult(req)
    if(!validationError.isEmpty()){
        console.log("error array", validationError.array())
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login', isAuthenticated: false,
            errorMessage : validationError.array()[0].msg,
            oldInput : {
                email ,
                password
            },
            validationErrors : validationError.array()
        });//indication that validation failed
       }
       User.findOne({email : email})
  
    
    .then(
        user => {

            if(!user){
                
                return res.redirect('/login')
            }
            //decode pass
        return  bcrypt.compare(password, user.password)
            .then(
                matched => {
                    if(matched){
                        req.session.isLoggedIn = true
                        req.session.user = user
                      return req.session.save((err)=>{
                            console.log(err)
                           
                            return res.redirect('/')
                        })
                    }
                    req.flash('error', 'Incorrect password')
                    res.redirect('/login')
                }
            )
        })
            .catch(err =>{
                console.log(err)
                res.redirect('/login')
            })

    
};

exports.postLogout = (req, res, next) => {
    //destroy is built in for session
   req.session.destroy(err =>{
    console.log(err)
    res.redirect('/login')
     })

}; 

exports.postSignup = (req, res, next) => {
   const email = req.body.email
   const password = req.body.password
   const confirmPassword = req.body.confirmPassword
   const validationError = validationResult(req)
   if(!validationError.isEmpty()){
    console.log("error array", validationError.array())
    return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup', isAuthenticated: false,
        errorMessage : validationError.array()[0].msg,
        oldInput : {
            email,
            password,
            confirmPassword
        },
        validationErrors : validationError.array()
    });//indication that validation failed
   }

   return bcrypt.hash(password, 12) //will generate hash pass, 12 has high security
    .then(hashPass => {
        const user = new User({
            email : email,
            password : hashPass,
            cart : {items : []}
        })
        
        return user.save()
        
    })
    .then(result => {
         return  transporter.sendMail({
            to : email,
            from : process.env.SENDER_EMAIL,
            subject : 'Signup succeeded!',
            html : '<h1>You successfully signed up!</h1>'
        })
        .then(result => {
            res.redirect('/login')
        })
      
   
})

.catch(err=> {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    const validationError = validationResult(req)
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup', isAuthenticated: false,
        errorMessage : message,
        oldInput : {
            email : "",
            password : "",
            confirmPassword : ""
        },
        validationErrors : []
    });
};

exports.getPasswordReset = (req, res, next) =>{
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password', 
        isAuthenticated: false,
        errorMessage : message,

     });

}

exports.postPasswordReset = (req, res, next) =>{
    //crypto for creating token
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err,"error resetting")
            res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email : req.body.email})
        .then(
            user => {
                if(!user){
                    req.flash('error', 'No account with that email found')
                    return res.redirect('/reset')
                }

                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            }

        )
        .then(result => {
            res.redirect('/')
            transporter.sendMail({
                to : req.body.email,
                from : process.env.SENDER_EMAIL,
                subject : 'Password Reset',
                html : 
                `
                <p>You requested a password reset </p>
                <p> Click this <a href="http://localhost:3000/reset/${token}" >link</a> to set a new password </p>
                `
            })
        })
        .catch(err=> {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
          })
    })
}

exports.getNewPassword = (req, res, next)=>{

    const token = req.params.token
    User.findOne({resetToken : token, resetTokenExpiration: {$gt: Date.now()}}) // $gt is greater than, we are comparing dates
    .then(
user =>{
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null
    }
    res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password', 
        isAuthenticated: false,
        errorMessage : message,
        userId : user._id.toString(),
        passwordToken : token
     });
}
    )
    .catch(err=> {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })

   
}

exports.postNewPassword = (req, res, next) =>{
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
let resetUser
    User.findOne({resetToken : passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id : userId})
    .then(user =>{
        resetUser = user
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword =>{
        resetUser.password = hashedPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiration = undefined
        return resetUser.save()
    })
    .then(result =>{
        res.redirect('/login')
        transporter.sendMail({
            to : resetUser.email,
            from : process.env.SENDER_EMAIL,
            subject : 'Password has been reset',
            html : 
            `
            <p>Your Password has been updated </p>
            <p> Click this <a href="http://localhost:3000/login" >link</a> to login </p>
            `
        })
    })
    .catch(err=> {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })

}