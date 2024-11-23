
const User = require('../models/user')



exports.getLogin = (req, res, next) => {
    
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login', isAuthenticated: false
    });


};


exports.postLogin = (req, res, next) => {
    User.findById('673b8852a7eaf1f84ccdc05b')
    .then(
        user => {
            req.session.isLoggedIn = true
            req.session.user = user
            req.session.save((err)=>{
                console.log(err)
                res.redirect('/')
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
    
}
)
.catch(err => console.log(err

))
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup', isAuthenticated: false
    });
};