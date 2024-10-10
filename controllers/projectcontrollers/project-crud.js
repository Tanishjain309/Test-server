import Task from "../../models/task-schema.js";
import Project from "../../models/project-schema.js";

export const createProject = async( req, res) => {
    try {
        const { name, description } = req.body;
        const owner = req.user.userId;
        const newProject = new Project({ name, description, owner });
        const savedProject = await newProject.save();
        return res.status(201).json(savedProject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating project", error });
    }     
}

export const getProject = async(req, res) => {
    try {
        const owner = req.user.userId;
        const projects = await Project.find({ owner: owner }).sort({createdAt: -1}).select(" _id name description");
        return res.status(200).json({data: projects});
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving projects", error });
    }
}

export const getIndividualProjectDetails = async(req, res) => {
    try{
        const { id } = req.params;
        const project = await Project.findById(id).populate({
            path: 'tasks',
            select: 'name priority status startDate endDate createdBy',
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ data: project });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving project details", error });
    }
};

export const updateProject = async(req, res) => {
    try {
        const { id } = req.params; // Get project ID from the request parameters
        const { name, description } = req.body; // Get updated values from request body

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ data: updatedProject, message:"Project Updated successfully" });
    } catch (error) {
        console.log("Update Project :", error);
        return res.status(500).json({ message: "Error updating project", error });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params; 
        await Task.deleteMany({ projectId: id });
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project and associated tasks deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting project", error });
    }
};
