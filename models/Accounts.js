const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AccountsSchema =new Schema({
email : {
    type : String
},
password : {
    type : String
},
name :{
    type : String
},
RDV : {
    type : Array
},
Birth : {
    type : String
},
gender : {
    type : String
},
acctype : {
    type : String
},
cabplace : {
    type : String
},
region : {
    type : String
},
cost : {
    type : Number
},
speciality : {
    type : String
},
approvement : {
    type : Boolean
}
})

module.exports=Accounts=mongoose.model("Accounts",AccountsSchema)