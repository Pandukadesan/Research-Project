const router = require("express").Router();
let user = require("../models/user");

router.route("/add").post((req, res) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const newUser = new user({
        name,
        email,
        password,
        role
    });

    newUser.save()
        .then(() => res.json("New User Added!"))
        .catch(err => {
            console.log(err);
            res.status(400).json("Error: " + err.message);
        });
});

router.route("/getDetails/:email").get((req,res) => {
    const email = req.params.email;

    user.find({email : email}).then((user) => {
        res.json(user);
    }).catch((err) => {
        console.log(err);
    })
})



module.exports = router;
