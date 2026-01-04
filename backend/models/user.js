const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name: {
        type: String,
        unique: true
    },

    email : {
        type : String,
        require : true
    },

    password : {
        type : String,
        require : true
    },

    role : {
        type : String,
        reqire : true
    },

})

const user = mongoose.model("user ",userSchema);

module.exports = user;