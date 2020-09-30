const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');


router.get('/', (req,res)=>{
    res.send({
        'message':'API working'
    })
})

router.post('/login', (req,res, next)=>{
    let authProcess = passport.authenticate('local', async(err, user, info)=>{
        if (err) {
            res.send({
                'message':'Error logging in'
            })
        }

        if (!user) {
            res.send({
                'message':'Cannot find user'
            });
        }

        req.logIn(user, {session:false}, async (loginError)=>{
            if (loginError) {
                return res.send({
                    'message':"Error logging in"
                })
            } else {
                // generate the access token
                const body = {_id:user._id, email:user.email};
                const token = jwt.sign({
                    user:body
                }, "TOP_SECRET")
                return res.send({token});
            }

        })
    }) // end authProcess

    authProcess(req, res, next);
})

router.get('/protected', passport.authenticate('jwt', {session:false}), 
    (req,res)=>{
        res.send({
            'message':'Top secret'
        })
});

module.exports = router;