const router = require("express").Router();
let service = require("../models/serviceModel");
const { storeMileage , getAllMileageRecords } = require("../blockchainService");


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
        const txHash = await storeMileage(engineNumber, chassisNumber, serviceNumber, newMileage);

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

// 🔗 GET ALL SERVICE RECORDS FROM BLOCKCHAIN
router.route("/blockchain/all").get(async (req, res) => {
  try {
    const { getAllMileageRecords } = require("../blockchainService");

    console.log("Calling getAllMileageRecords...");

    const records = await getAllMileageRecords();

    res.json({
      source: "blockchain",
      total: records.length,
      records
    });
  } catch (err) {
    console.error("BLOCKCHAIN ERROR 👉", err); // 👈 ADD THIS
    res.status(500).json({
      error: "Failed to fetch blockchain records",
      details: err.message
    });
  }
});

router.get("/blockchain/getServiceRecords/:engineNumber/:chassisNumber", async (req, res) => {
  try {
    const { engineNumber, chassisNumber } = req.params;

    const allRecords = await getAllMileageRecords();

    const filteredRecords = allRecords.filter(
      (r) => r.engineNumber === engineNumber && r.chassisNumber === chassisNumber
    );

    res.json({
      source: "blockchain",
      total: filteredRecords.length,
      records: filteredRecords
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch blockchain records",
      details: err.message
    });
  }
});


module.exports = router;
