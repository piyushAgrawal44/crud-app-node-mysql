// Require necessary modules
import express from "express";
import cors from 'cors';
import { route } from "./route/route.js";
// Create an Express application
const app = express();

app.use((express.json()));

// Start the Express server
const PORT = process.env.PORT || 8000;

app.use(cors());
// app.use(cors({origin:["http://localhost:3000",], methods: ['GET','POST','DELETE'], credentials: true,}));

app.use('/', route);
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
