const { ToDo } = require('../models');

const authorize = async (req, res, next) => {
    try {
        const { id } = req.params;
        const UserId = req.decoded.id;

        const data = await ToDo.findOne({
            where: { id },
        });

        if (!data)
            throw {
                status: 404,
                msg: 'id not found',
            };

        if (data.UserId !== UserId)
            throw {
                status: 401,
                msg: 'not authorized',
            };

        next();
    } catch (err) {
        if (err.status === 404) {
            res.status(404).json({ msg: err.msg });
        } else if (err.status === 401) {
            res.status(401).json({ msg: err.msg });
        } else {
            res.status(500).json({});
        }
    }
};

module.exports = authorize;
