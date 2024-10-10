import Task from "../../models/task-schema.js";
import Project from "../../models/project-schema.js";
import User from "../../models/user-schema.js";

// Create a new task
export const createTask = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, startDate, endDate, priority, status } = req.body;
  const userId = req.user.userId;
  try {
    // Ensure the project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Create a new task
    const newTask = new Task({
      name,
      createdBy: userId,
      startDate,
      endDate,
      priority,
      status,
      project: id,
    });

    const savedTask = await newTask.save();
    project.tasks.push(savedTask._id);
    await project.save();

    return res
      .status(200)
      .json({ message: "Task created successfully", data: savedTask });
  } catch (error) {
    console.log("CreateTask Error", error);
    return res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, priority, status } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task fields
    task.name = name || task.name;
    task.startDate = startDate || task.startDate;
    task.endDate = endDate || task.endDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    const updatedTask = await task.save();

    return res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Project.updateOne(
      { _id: task.project },
      { $pull: { tasks: task._id } }
    );
    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    console.log("Cron Job Started...");
    const now = new Date();
    const result = await Task.updateMany(
      { endDate: { $lt: now }, status: { $ne: "expired" } },
      { status: "expired" }
    );
    console.log(`Updated tasks to expired status.`);
    console.log("Cron Job Completed");
  } catch (error) {
    console.error("Error updating tasks:", error);
  }
};
