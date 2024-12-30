const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const authRoutes = require('./src/users/user.route')
//

// middleware 
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//routes 
app.use('/api/auth', authRoutes)

main()
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


async function main() {
    await mongoose.connect(process.env.MONGO_DB_URI);

    app.get('/', (req, res) => {
        res.send('Sir Karabo E-commerce Server is running !')
    })
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 