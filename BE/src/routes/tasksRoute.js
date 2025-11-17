import express from 'express';
import { createTasks, deleteTask, getAllTasks, updateTask } from '../controllers/tasksControllers.js';

const router = express.Router();

router.get("/", getAllTasks)

router.post("/", createTasks);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;