const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
//auth routes
const authRoutes = require('./src/users/user.route')
const productsRoutes = require('./src/products/products.route')
const reviewsRouter = require('./src/reviews/reviews.router')
const ordersRoutes = require('./src/orders/orders.route')

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
app.use('/api/products', productsRoutes)
app.use('/api/reviews', reviewsRouter)
app.use('/api/orders', ordersRoutes)

main()
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


async function main() {
    await mongoose.connect(process.env.MONGO_DB_URI);

    app.get('/', (req, res) => {
        res.send('The Green Republic E-commerce Server is running !')
    })
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 