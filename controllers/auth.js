
exports.getLogin = (req, res, next) => {
    const isLoggedIn = req
        .get('Cookie')
        .split(';')[0]
        .trim()
        .split('=')[1] === 'true'
    console.log(req
        .get('Cookie'), 'isLo')
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login', isAuthenticated: isLoggedIn
    });


};


exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true') //this will set a cookie
    res.redirect('/')

};