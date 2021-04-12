const { User } = require('../models');
const { comparePass } = require('../helpers/bcrypt.js');
const { generateToken } = require('../helpers/jwt.js');
const { OAuth2Client } = require('google-auth-library');

class UserController {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const newUser = {
                email,
                password,
            };

            const data = await User.create(newUser);

            if (!data) throw err;

            res.status(201).json({
                msg: 'Register success',
                id: data.id,
                email: data.email,
            });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const data = await User.findOne({
                where: { email },
            });

            if (!data)
                throw {
                    name: 'CustomError',
                    msg: 'Invalid Email or Password',
                    status: 400,
                };

            const comparePassword = await comparePass(password, data.password);

            if (!comparePassword)
                throw {
                    name: 'CustomError',
                    msg: 'Invalid Email or Password',
                    status: 400,
                };

            const access_token = generateToken({
                id: data.id,
                email: data.email,
            });

            res.status(200).json({ access_token });
        } catch (err) {
            next(err);
        }
    }

    static async googleLogin(req, res, next) {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        let email = '';
        client
            .verifyIdToken({
                idToken: req.body.googleToken,
                audience: process.env.CLIENT_ID,
            })
            .then((ticket) => {
                const payload = ticket.getPayload();
                email = payload.email;
                return User.findOne({
                    where: { email },
                });
            })
            .then((user) => {
                if (!user) {
                    return User.create({
                        email,
                        password: process.env.CLIENT_SECRET,
                    });
                } else {
                    const access_token = generateToken({
                        id: user.id,
                        email: user.email,
                    });
                    res.status(200).json({ access_token });
                }
            })
            .then((registeredUser) => {
                const access_token = generateToken({
                    id: registeredUser.id,
                    email: registeredUser.email,
                });
                res.status(201).json({ access_token });
            })
            .catch((err) => {
                next(err);
            });
    }
}

module.exports = UserController;
