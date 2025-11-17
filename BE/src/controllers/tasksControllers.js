import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {

    const {filter = 'today'} = req.query;
    const now = new Date();
    let startDate;

    switch (filter) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'all':
            default: {
                startDate = null;
            }
    }

        const query = startDate ? { createdAt: { $gte: startDate } } : {};

    try {
        const result = await Task.aggregate([
            {
                $match: query
            },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeTasksCount: [{ $match: { status: 'active' } }, { $count: 'count' }],
                    completedTasksCount: [{ $match: { status: 'complete' } }, { $count: 'count' }],
                },
            },
        ]);

        const tasks = result[0].tasks;
        const activeTasksCount = result[0].activeTasksCount[0] ?.count || 0;
        const completedTasksCount = result[0].completedTasksCount[0] ?.count || 0;

        res.status(200).json({tasks, activeTasksCount, completedTasksCount});
    } catch (error) {
        console.log('something wrong:', error);
        res.status(500).json({message: "error system"})
    }
};

export const createTasks = async (req, res) => {
    try {
        const {title} = req.body;
        const task = new Task({title});

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log('something wrong:', error);
        res.status(500).json({message: "error system"})
    }
};

export const updateTask = async (req, res) => {
    try {
        const {title, status, completedAt} = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt,
            },
            {new: true}
        );

        if (!updatedTask) {
            return res.status(404).json({message:'task not exited'})
        }

        res.status(200).json(updatedTask)
    } catch (error) {
        console.log('something wrong:', error);
        res.status(500).json({message: "error system"})
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        if (!deleteTask) {
            return res.status(404).json({message: 'no tasks'})
        }

        res.status(200).json(deleteTask);

    } catch (error) {
        console.log('something wrong:', error);
        res.status(500).json({message: "error system"})
    }
};