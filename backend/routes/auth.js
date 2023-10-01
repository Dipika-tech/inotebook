const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const fetchUser = require('../middleware/fetchuser')
require('dotenv').config()
const router = express.Router()
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;


// ROUTE1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name.').isLength({min: 3}),
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password must be atleast 5 characters.').isLength({min: 5})
], async (req, res)=>{

    //error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        // Check user uniqueness
        let user = await User.findOne({email: req.body.email}) 
        if(user){
            return res.status(400).json({error: "User with this email already exist."});
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // create user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        console.log(authToken)

        return res.json({authToken})

    } catch (error) {
        console.error({"internal_error": error.message})
        return res.status(500).send("Internal Server Error");
    }
})


// ROUTE2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password Cannot be blank.').exists(),
], async (req, res)=>{
    console.log(JWT_SECRET)

    //error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)

        return res.json({authToken})

    } catch (error) {
        console.error({"internal_error": error.message})
        return res.status(500).send("Internal Server Error");
    }

})


// ROUTE3: Get logged in user detail using: GET "/api/auth/getuser".
router.get('/getuser', fetchUser,async (req, res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("name email date -_id")
        return res.json(user)
        
    } catch (error) {
        console.error({"internal_error": error.message})
        return res.status(500).send("Internal Server Error");
    }

})


module.exports = router