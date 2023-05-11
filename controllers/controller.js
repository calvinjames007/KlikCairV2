const {User, Profile, Loan, Platform} = require('../models')
const {Op} = require('sequelize')

class Controller {
    static showFormRegisterUser (req, res) {
        res.render('2_registerPage')
    }

    static addNewUser (req, res) {
        const {email, password} = req.body
        console.log(req.body)
        User.create({
            email:email,
            password:password,
        })
        .then((data) => {
            res.redirect('/')

        })
        .catch((err) => {
            res.send(err)
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
                    res.redirect("/user/dashboard")
                } else {
                    const errors = `Invalid+user+or+password`;
                    res.redirect(`/login?errors=${errors}`)
                }
            } else {
                const errors = `User+or+password+not+found`;
                    res.redirect(`/login?errors=${errors}`)
            }
        })
        .catch((err) => {
            res.send(err)
        });
    }

    static showDashboard (req, res) {
        res.render('4_dashboard')
    }

}

module.exports = Controller