
const User = require('../models/user')
const bcrypt = require('bcryptjs')


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
        errorMessage : message
     });


};


exports.postLogin = (req, res, next) => {

    const email = req.body.email
    const password = req.body.password

    User.findOne({email : email})
  
    
    .then(
        user => {

            if(!user){
                //'error' is key
                req.flash('error', 'Invalid email or password')
                return res.redirect('/login')
            }

            //decode pass
            bcrypt.compare(password, user.password)
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
            .catch(err =>{
                console.log(err)
                res.redirect('/login')
            })

         
        }
    )

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
   const confirmedPassword = req.body.confirmPassword
User.findOne({email : email})
.then(
    existed =>
{
    if(existed){
        req.flash('error', 'Email already exist')
     return  res.redirect('/signup')
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
        res.redirect('/login')
    })
   
})

.catch(err => console.log("error signup",err

))
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup', isAuthenticated: false,
        errorMessage : message
    });
};