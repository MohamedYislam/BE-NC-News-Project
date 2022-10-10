const express = require('express')
const app = express();

app.use(express.json());
getTopics = () => {
   
}
app.get('/api/topics', getTopics)

