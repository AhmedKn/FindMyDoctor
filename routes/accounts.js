const express = require("express")


const router=express.Router()
const Accounts = require("../models/Accounts")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport=require("passport")

//http://localhost:5000/FindMyDoc/modifyapp/:id1/:id2
//@desc modify approvements
router.put("/modifyapp/:id1/:id2" ,(req , res)=>{
    var id1 = req.params.id1;
    var id2 = req.params.id2;

    const {approvement, date , time} = req.body;
    Accounts.findOneAndUpdate({_id : id1 } , {$set:{"RDV.0.time" : time}})
    .then(user => res.json(user))
    .catch(err => console.err(err))
  })


//http://localhost:5000/FindMyDoc/show
//@desc show the data base 

        router.get("/show" , (req , res)=>{
            Accounts.find({}) 
            .then((data)=>{
                res.send(data);
              })
             .catch((err)=>{
               console.log(err);
             })
            })

//http://localhost:5000/user/RDV/id1/id2
//@desc show the doctor information by id2

router.get("/user/RDV/:id1/:id2" , (req , res)=>{
    id = req.params.id2
    Accounts.find({_id : id}) 
    .then((data)=>{
        res.send(data);
      })
     .catch((err)=>{
       console.log(err);
     })
    })

    //http://localhost:5000/FindMyDoc/add/RDV/:id1/:id2
    //@desc add rdv to patient and patient

    router.put("/add/RDV/:id1" ,(req , res)=>{
      var id1 = req.params.id1;

      const {id , name , Birth , region , description , approvement , docname , docspeciality , date , time ,patid} = req.body;
      Accounts.findOneAndUpdate({_id : id1} , {
          $push:{RDV : {id , name , Birth , region , description ,approvement , docname ,docspeciality , date , time , patid}}
      } )
      .then(user => res.json(user) )
      .catch(err => console.err(err))
    })



//http://localhost:5000/FindMyDoc/add/patient
//@desc add patient account

router.post("/add/patient",(req,res)=>{

    const {name ,
        password ,
        email ,
        Birth ,
        gender ,
        acctype ,
        region } = req.body
    
Accounts.findOne({email}).then((account) =>{
    if (account) return res.sendStatus(409);
    else {
        const accounts = new Accounts({
            name ,
            password ,
            email ,
            Birth ,
            gender ,
            acctype ,
            region 
        })

        //crypt the code

        bcrypt.genSalt(10 , (err , salt) =>{
            bcrypt.hash(password , salt ,(err,hash)=>{
                accounts.password=hash;
                accounts.save()
                .then((newacc) => res.json(newacc))
                .catch((err) => console.error(err))
            })
        })

    }
  
}) 




    .then(result => console.log(result))
    .catch(err => console.log(err))
    })



    //http://localhost:5000/FindMyDoc/add/doctor
//@desc add doctor account

router.post("/add/doctor",(req,res)=>{

    const {name ,
        password ,
        email ,
        Birth ,
        gender ,
        acctype ,
        region,
        cabplace ,
        speciality,
        cost } = req.body
    
Accounts.findOne({email}).then((account) =>{
    if (account) return res.sendStatus(409);
    else {
        const accounts = new Accounts({
            name ,
            password ,
            email ,
            Birth ,
            gender ,
            acctype ,
            region ,
            cabplace ,
        speciality,
        cost
        })
        
        //crypt the code

        bcrypt.genSalt(10 , (err , salt) =>{
            bcrypt.hash(password , salt ,(err,hash)=>{
                accounts.password=hash;
                accounts.save()
                .then((newacc) => res.json(newacc))
                .catch((err) => console.error(err))
            })
        })

    }
  
}) 



    .then(result => console.log(result))
    .catch(err => console.log(err))
    })

    //login user !
router.post("/login" , (req , res)=>{
    const {email , password} = req.body;
    Accounts.findOne({email}).then(user =>{
        if(!user) res.sendStatus(404)
        else {
            bcrypt.compare(password,user.password)
            .then(isMatched =>{
                if (isMatched){
                    const payload={id:user._id , email : user.email,name : user.name, Birth : user.Birth , gender : user.gender ,region : user.region,cabplace : user.cabplace,speciality:user.speciality  , acctype : user.acctype , RDV : user.RDV}
                    jwt.sign(payload , "session" , {expiresIn:3600}, (err ,token)=>{
                        if(err) res.sendStatus(500)
                        else {
                            res.json({token : token})
                        }
                    })
                }else{
                    res.sendStatus(400)
                }
            })
        }
    }).catch(err => res.send('server error'))
})

// validate token
router.get("/validate" , passport.authenticate("jwt" , {session:false}) ,(req,res)=>{
    res.send(req.user)
})

        
module.exports = router