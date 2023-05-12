'use strict';
const {Model} = require('sequelize');
const bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Loan)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "Please insert your email"
        },
        notNull: {
          msg: "Please insert your email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "Password cannot empty"
        },
        notNull: {
          msg: "Password cannot empty"
        }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate(data, options) {
          const salt = bcrypt.genSaltSync(8);
          const hash = bcrypt.hashSync(data.password, salt);
          data.password = hash;
      }
    },
    modelName: 'User',
  });
  return User;
};