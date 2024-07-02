import express from 'express'

const app = express();

app.listen(3000, ()=>{
    console.log("Server is running in 3000 port!");
})