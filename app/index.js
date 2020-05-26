'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: 'localhost',
        port: '3306',
        dialect: 'mysql'
    });
}

let files = fs.readdirSync('./app/models');
let models = []
files.forEach((file) => {
    if ((file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')) {
        models.push(require('./models/' + file))
    }
})
models.forEach(model => {
    const seqModel = model(sequelize, Sequelize)
    db[seqModel.name] = seqModel
})

Object.keys(db).forEach(modelName => {
    let model = db[modelName]
    let modelAttributes = model.rawAttributes
    let modelAttributeKeys = Object.keys(modelAttributes)
    modelAttributeKeys.forEach(attribute => {
        if (modelAttributes[attribute].references) {
            let linkData = modelAttributes[attribute].references
            let refModelName = Object.keys(db).find(
                model => model === linkData.model
            )
            if (refModelName) {
                let refModel = db[refModelName]
                if (trans.associations[refModelName]) {
                    model.belongsTo(refModel, {
                        foreignKey: attribute,
                        onDelete: 'CASCADE',
                        as: trans.associations[refModelName]
                    })
                } else {
                    model.belongsTo(refModel, {
                        foreignKey: attribute,
                        onDelete: 'CASCADE',

                    })
                }
            }

        }
    })
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
