const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    
    engineNumber: {
        type: String,
        require: true
    },

    chassisNumber : {
        type : String,
        require : true
    },

    serviceCentre : {
        type : String,
        require : true
    },

    newMileage : {
        type : String,
        reqire : true
    },

    serviceNumber : {
        type : String,
        reqire : true
    },

    serviceDate : {
        type : String,
        reqire : true
    },

})

const service = mongoose.model("service",serviceSchema);

module.exports = service;