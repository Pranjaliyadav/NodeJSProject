const express = require('express')

const router = express.Router()


router.get('/', (req, res, next) => {
    console.log("In random page")
    res.send("<h1>Hello random page</h1>")
})

module.exports = router