const { ToDo } = require('../models');

class ToDoController {
    static async createToDo(req, res, next) {
        try {
            const UserId = req.decoded.id;
            const { title, description, status, due_date } = req.body;

            const newToDo = {
                title,
                description,
                status,
                due_date,
                UserId,
            };

            const data = await ToDo.create(newToDo);

            if (!data) throw err;

            res.status(201).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getAll(req, res, next) {
        try {
            const UserId = req.decoded.id;
            const data = await ToDo.findAll({
                where: { UserId },
            });

            if (!data) throw err;

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async editAllFieldById(req, res, next) {
        try {
            const UserId = req.decoded.id;
            const { id } = req.params;
            const { title, description, status, due_date } = req.body;

            const editedToDo = {
                title,
                description,
                status,
                due_date,
                UserId,
            };

            const data = await ToDo.update(editedToDo, {
                where: { id },
                returning: true,
            });

            if (!data) throw err;

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async editSpecificFieldById(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const data = await ToDo.update(
                { status },
                {
                    where: { id },
                    returning: true,
                }
            );

            if (!data) throw err;

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async deleteById(req, res, next) {
        try {
            const { id } = req.params;

            const data = await ToDo.destroy({
                where: { id },
            });

            if (!data) throw err;

            res.status(200).json({
                msg: 'success to delete todo',
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ToDoController;
