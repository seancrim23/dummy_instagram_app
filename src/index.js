const express = require('express');
const { connectDb } = require('./db/mongoose');
const userRouter = require('./routes/userRouter');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
    connectDb();
});