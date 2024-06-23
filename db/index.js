const { Sequelize, DataTypes } = require('sequelize');
const pg = require("pg")

// console.log({db:process.env.DB_HOST});

const sequelize = new Sequelize(
  "bu5ntbmo07mpfpaikkhl",
  "urffpo2zvyhgjsosw83p",
  "IzvOjOBNsFHqc7OuInLWbUnhQNcd6Q",
  {
    host: "bu5ntbmo07mpfpaikkhl-postgresql.services.clever-cloud.com",
    port: '50013',
    dialect: "postgres",
    dialectModule: pg,
    // dialectOptions: {
    //   ssl: {
    //     require: true, // This will help you. But you will see nwe error
    //     rejectUnauthorized: false // This line will fix new error
    //   }
    // },   
  }
);

// console.log({sequelize});

module.exports = {
  sequelize
};
