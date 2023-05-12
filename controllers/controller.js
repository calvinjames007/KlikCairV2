const {User, Profile, Loan, Platform} = require('../models')
const {Op} = require('sequelize')
const bcrypt = require('bcryptjs')
const currency = require('../helper/formatter')
const moment = require('moment/moment')

class Controller {
    static showFormRegisterUser (req, res) {
        const errors = req.query.errors ? req.query.errors.split(',') : [];
        res.render('2_registerPage', {errors: req.query.errors})
    }

    static addNewUser (req, res) {
        const {email, password} = req.body
        console.log(req.body)
        User.create({
            email:email,
            password:password,
        })
        .then((data) => {
            return Profile.create({
                name: `user-${email}`,
                age: 0,
                address: `Indonesia`,
                UserId: data.id
            })
        })
        .then((data) => {
            res.redirect('/')

        })
        .catch((err) => {
            let errorMessages = err.errors.map(el => {
                return el.message
            })
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                res.redirect(`/user/add?errors=${errorMessages}`)
            } else {
                res.send(err)
            }
        })
    }

    static showFormLogin (req, res) {
        res.render('3_loginPage')
    }

    static postLogin (req, res) {
        const {email, password} = req.body
        console.log(req.body)
        User.findOne({where: {email}})
        .then((user) => {
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password);

                if (isValidPassword) {
                    console.log('masuk di 1')
                    req.session.UserId = user.id;
                    return res.redirect(`/user/dashboard`)
                } else {
                    console.log('masuk di 2')
                    const errors = `Invalid+user+or+password`;
                    return res.redirect(`/login?errors=${errors}`)
                }
            } else {
                const errors = `User+or+password+not+found`;
                    console.log('masuk di 3')
                    return res.redirect(`/login?errors=${errors}`)
            }
        })
        .catch((err) => {
            res.send(err)
        });
    }

    static showDashboard (req, res) {
        const {id} = req.session.id
        Loan.findOne({
            where: {
                UserId : req.session.UserId
            },
            include: [{model: Platform}]
        })
        .then((data) => {
            const dataArray = Array.isArray(data) ? data : [data]
            res.render('4_dashboard', {data: dataArray, currency, moment})
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static showLoanForm(req, res) {
        const errors = req.query.errors ? req.query.errors.split(',') : [];
        res.render('5_loanPage', {errors: req.query.errors}) 
    }

    static PostLoan(req, res) {
        const {UserId, PlatformId, totalLoan} = req.body
        
        Loan.create({
            UserId:req.session.UserId.toString(),
            PlatformId:PlatformId,
            totalLoan:totalLoan
        })
        .then((data) => {
            res.redirect('/user/dashboard')
        })
        .catch((err) => {
            let errorMessages = err.errors.map(el => {
                return el.message
            })
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                res.redirect(`/user/loan?errors=${errorMessages}`)
            } else {
                res.send(err)
            }
        })
    }

    static showLocation(req, res) {
        const { search, sort } = req.query;

       if (sort) {
        Platform.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        .then((result) => {
            res.render("6_locationPage", {result, currency, title: `Find Your Platform Location`})    
            })
        .catch((err) => {
            res.send(err);
        });
       }

        Platform.findByLocation(search)
        .then((result) => {
        res.render("6_locationPage", {result, currency, title: `Find Your Platform Location`})    
        })
        .catch((err) => {
            res.send(err);
        });
    }

    static showProfile(req, res) {
        console.log(req.session);
        Profile.findOne({
            where: {
                UserId: req.session.UserId
            }
        })
        .then((result) => {
            res.render("7_profilePage", {result, title: `My Profile`})
            // res.send(result)
        })
        .catch((err) => {
            res.send(err);
        });
    }

    static showEditProfileForm(req, res) {
        Profile.findOne({
            where: {
                UserId: req.session.UserId
            }
        })
        .then((result) => {
            res.render('8_editProfilePage', {result})
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static editProfileForm(req, res) {
        const {name, age, address} = req.body

        Profile.update({
            name:name,
            age:age,
            address:address
        }, {where:{UserId : req.session.UserId}})
        .then((data) => {
            res.redirect('/user/profile')
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static deleteProfile(req, res) {
        Profile.destroy({
            where: {UserId : req.session.UserId}
        })
        .then((data) => {
            return Loan.destroy({
                where: {UserId : req.session.UserId}
            })
        })
        .then((data) => {
            return User.destroy({
                where: {id : req.session.UserId}
            })
        })
        .then(() => {
            res.redirect('/user/logout')
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static logout(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/user/login");
            }
          })
    }

}

module.exports = Controller