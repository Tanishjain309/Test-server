import { Schema, model } from 'mongoose';
const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task',
    }]
    }, {
    timestamps: true
});

const Project = model('Project', ProjectSchema);
export default Project;