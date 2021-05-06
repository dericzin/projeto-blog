const express = require("express");
const router = express.Router();
const Admin = require("./Admin");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/users", adminAuth, (req, res) => {

    Admin.findAll().then(admin => {
        res.render("admin/admin/index", {admin: admin})
    });
});

router.get("/admin/users/create", adminAuth, (req ,res) => {
    res.render("admin/admin/create");

});

router.post("/admin/create", adminAuth, (req, res) => {
    var email = req.body.email;
    var password = req.body.password;


    Admin.findOne({where:{email : email}}).then( user => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            Admin.create({
                email: email, 
                password : hash
            }).then (() => {
                res.redirect("/admin/users");
            }).catch(() => {
                res.redirect("/");
            });
        }else{
            res.render("admin/admin/error")
        }
    });
});

router.get("/login", (req, res) => {
    res.render("admin/admin/login")
});

router.post("/authenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    Admin.findOne({where:{email: email}}).then(admin => {
        if(admin != undefined){
            var correct = bcrypt.compareSync(password, admin.password);
            if(correct){
                req.session.user = {
                    id: admin.id,
                    email: admin.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login");
            }

        }else{
            res.redirect("/login");
        }
    });
});

router.post("/users/delete", (req, res) =>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Admin.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/users");
        }
    }else{ // NULL
        res.redirect("/admin/users");
    }
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;