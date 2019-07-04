const express = require('express');
const { connectDb } = require('./db/mongoose');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
    connectDb();
});