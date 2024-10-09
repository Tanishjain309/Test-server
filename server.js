import express, { json, urlencoded } from "express";
import { connect } from 'mongoose';
import {config} from "dotenv";
import authRoutes from "./routes/auth-route.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

app.listen(port, () =>{
    console.log("Server Running on port 8080")
});