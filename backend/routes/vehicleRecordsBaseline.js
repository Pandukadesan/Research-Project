const router = require("express").Router();
let VehicleRecordsBaseline = require("../models/vehicleRecordsBaselineModel");

router.route("/add").post((req, res) => {
    const {
        engineNumber,
        chassisNumber,
        registrationDate,
        baselineMileage,
        make,
        model,
        year,
        verifierInfo,
        timestamp
    } = req.body;

    const newVehicleRecordBaseline = new VehicleRecordsBaseline({
        engineNumber,
        chassisNumber,
        registrationDate,
        baselineMileage,
        make,
        model,
        year,
        verifierInfo,
        timestamp
    });

    newVehicleRecordBaseline.save()
        .then(() => res.json("Vehicle Record Baseline Added!"))
        .catch(err => {
            console.log(err);
            res.status(400).json("Error: " + err.message);
        });
});

module.exports = router;
