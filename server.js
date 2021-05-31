'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
app.use(cors());
const PORT = process.env.PORT;


mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });


//  create collections
//  create schema and model
const userSchema = new mongoose.Schema({
    email: String,
    books: []
});

const userModel = mongoose.model('user', userSchema);


function seedInitialBooks() {
    const yahia = new userModel({
        email: 'yahiaqous@gmail.com',
        books: [
            {
                name: 'Green Migraine by Michael Dickman',
                description: "Each section of this book is a color. It's a fascinating and quite successful way to rethink sensation, and in this case, pain",
                status: 'On Sale',
                url: 'https://www.mydomaine.com/thmb/ePN7WiRpZqmZqZDqw_j6nJ87pTY=/1928x2396/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/91FulkQLHiL-19931046c8c94b799863e7fc62b0a90e.jpg'
            },
            {
                name: 'As I Lay Dying by William Faulkner',
                description: "takes on a unique form, as it's first told from the perspective of a dead matriarch and then by living members of her family",
                status: 'Available',
                url: 'https://www.mydomaine.com/thmb/-sCcbRhfiSGVhdPIQDkjgvi9WZo=/1557x2400/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/91yR2PB2KL-d5b9b173743249d09ec7a2ffd6bd4275.jpg'
            },
            {
                name: 'Night Sky with Exit Wounds by Ocean Vuong',
                description: "This collection of poetry is as beautiful as the title implies, full of lyrical yet accessible language that unrelentingly fills you with feelings you didn't know you had until you read it",
                status: 'Not Exist',
                url:'https://www.mydomaine.com/thmb/d2uWYELuIcwaHm2_goDtH_1Gin8=/1865x2560/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9161zsTJi3L-185e288c564341888e3c1e0e781c3f30.jpg'
            }
        ]
    })
    yahia.save();
}
//  seedInitialBooks();


app.get('/books', booksHandler)

function booksHandler(req, res) {
    let userEmail = req.query.email;
    userModel.find({ email: userEmail }, function (err, userData) {
        if (err) {
            console.log('did not work')
        } else {
            console.log(userData);
            console.log(userData[0].books);
            res.send(userData[0].books);
        }
    })
}




app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})