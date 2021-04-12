'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const { hashPass } = require('../helpers/bcrypt.js');
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasMany(models.ToDo, {
                foreignKey: 'UserId',
                sourceKey: 'id',
            });
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: {
                        args: true,
                        msg: 'Invalid email format',
                    },
                },
                unique: {
                    args: true,
                    msg: 'Email already registered',
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    minimumLength(value) {
                        if (value.length < 6) {
                            throw new Error(
                                'Password must be 6 characters minimum'
                            );
                        }
                    },
                },
            },
        },
        {
            hooks: {
                beforeCreate: (User) => {
                    User.password = hashPass(User.password);
                },
            },
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
