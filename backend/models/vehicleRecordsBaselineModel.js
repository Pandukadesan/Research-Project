const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vehicleRecordsBaselineSchema = new Schema({
    
    engineNumber : {
        type : String,
        require : true
    },

    chassisNumber : {
        type : String,
        require : true
    },

    registrationDate : {
        type : Date,
        reqire : true
    },

    baselineMileage : {
        type : Number,
        reqire : true
    },

    make : {
        type : String,
        reqire : true
    },

    model : {
        type : String,
        reqire : true
    },

    year : {
        type : Number,
        reqire : true
    },

    verifierInfo : {
        type : String,
        reqire : true
    },

    timestamp : {
        type : Date,
        default : Date.now
    },

})

const VehicleRecordsBaseline = mongoose.model("VehicleRecordsBaseline ",vehicleRecordsBaselineSchema);

module.exports = VehicleRecordsBaseline;