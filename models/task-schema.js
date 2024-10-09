import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Expired'],
        default: 'Pending',
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    }
  }, {
    timestamps: true
});

const Task = model('Task', TaskSchema);
export default Task;