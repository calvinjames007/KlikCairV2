'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Loan.belongsTo(models.User)
      Loan.belongsTo(models.Platform)
    }
  }
  Loan.init({
    UserId: DataTypes.INTEGER,
    PlatformId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : 'Please enter the amount money'
        },
        notNull: {
          msg : 'Please enter the amount money'
        },
        isReachLimit(value) {
          if (this.totalLoan > 3000000 && value === "3") {
            throw new Error('Jumlah yang anda ingin pinjam melebihi limit platforms')
          }
          if (this.totalLoan > 5000000 && value === "2") {
            throw new Error('Jumlah yang anda ingin pinjam melebihi limit platforms')
          }
        }
      }
    },
    totalLoan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : 'Please enter the amount money'
        },
        notNull: {
          msg : 'Please enter the amount money'
        }
      }
    },
    dueDate: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Loan',
  });

  Loan.beforeValidate((loan) => {
    if (loan.PlatformId === '3') {
      let future = new Date();
      future.setDate(future.getDate() + 90);
      loan.dueDate = future
    } else if (loan.PlatformId === '2') {
      let future = new Date();
      future.setDate(future.getDate() + 120);
      loan.dueDate = future
    } else if (loan.PlatformId === '1') {
      future = new Date();
      temp = future.setDate(future.getDate() + 360);
      loan.dueDate = future
    }
    loan.status = "Belum Dibayar"
  })

  return Loan;
};