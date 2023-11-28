import express from "express";
import bodyParser from "body-parser";

import todosRoutes from "./routes/todos";

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.use(todosRoutes);

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
