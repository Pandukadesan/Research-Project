const router = require("express").Router();
let service = require("../models/serviceModel");
const { storeMileage } = require("../blockchainService");


router.route("/add").post(async (req, res) => {
    const { engineNumber, chassisNumber, serviceCentre, newMileage, serviceNumber, serviceDate } = req.body;

    const newService = new service({
        engineNumber,
        chassisNumber,
        serviceCentre,
        newMileage,
        serviceNumber,
        serviceDate
    });

    try {
        await newService.save(); // Save to MongoDB

        // Save to blockchain
        const txHash = await storeMileage(serviceNumber, engineNumber, chassisNumber, newMileage);

        res.json({ message: "New Service Added!", blockchainTx: txHash });
    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err.message);
    }
});



router.route("/getServiceRecords/:engineNumber/:chassisNumber").get((req,res) => {
    const { engineNumber, chassisNumber } = req.params;

    service.find({engineNumber , chassisNumber}).then((service) => {
        res.json(service);
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;
