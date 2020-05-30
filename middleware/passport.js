const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");

const Accounts = mongoose.model("Accounts")
const opts={}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey="session"

module.exports = passport =>{
    passport.use(new JwtStrategy(opts , (jwt_payload , done)=>{
        Accounts.findById(jwt_payload.id).then(user =>{
            if (user){
                return done (null , user)
            }
            else {
                return done(null , false)
            }
        }).catch(err => console.error(err))
    }))
}