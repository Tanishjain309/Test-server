import express, { json, urlencoded } from "express";
import { connect } from 'mongoose';
import {config} from "dotenv";
import authRoutes from "./routes/auth-route.js";
import projectRoutes from "./routes/project-routes.js";
import taskRoutes from "./routes/task-routes.js"
import cors from 'cors';
import { CronJob } from "cron";
import cookieParser from 'cookie-parser';
import { updateTaskStatus } from "./controllers/taskcontrollers/task-crud.js";
config();
const app = express();
const port = process.env.PORT;
//Connection to the Database
connect(process.env.URI)
.then(() => {
    console.log("DB Connected Successfully");
}).catch((error) => {
    console.log(error);
});

let corsOpts;
if(process.env.node_environment === "development"){
    corsOpts = {
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:8080'],
    }
}else {
    corsOpts = {
        credentials: true,
        origin: [] //Add client and server domain in production
    }
};

app.use(cors(corsOpts));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes, taskRoutes);

app.listen(port, () =>{
    console.log("Server Running on port 8080")
});

new CronJob('52 12 * * *', updateTaskStatus, null, true, 'UTC');