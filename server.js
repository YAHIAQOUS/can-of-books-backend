'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();


// const PORT = process.env.PORT;
const PORT = process.env.PORT;

const server = express();
server.use(express.json());
server.use(cors());



const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://yahiaqous:12345@can-of-books-shard-00-00.8brwi.mongodb.net:27017,can-of-books-shard-00-01.8brwi.mongodb.net:27017,can-of-books-shard-00-02.8brwi.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1035nr-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });



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
                description: "Each section of this book is a color. It's a fascinating and quite successful way to rethink sensation, and in this case",
                status: 'On Sale',
                imgURL: 'https://www.mydomaine.com/thmb/ePN7WiRpZqmZqZDqw_j6nJ87pTY=/1928x2396/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/91FulkQLHiL-19931046c8c94b799863e7fc62b0a90e.jpg'
            },
            {
                name: 'As I Lay Dying by William Faulkner',
                description: "takes on a unique form, as it's first told from the perspective of a dead matriarch and then by living members of her family",
                status: 'Available',
                imgURL: 'https://www.mydomaine.com/thmb/-sCcbRhfiSGVhdPIQDkjgvi9WZo=/1557x2400/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/91yR2PB2KL-d5b9b173743249d09ec7a2ffd6bd4275.jpg'
            },
            {
                name: 'Night Sky with Exit Wounds by Ocean Vuong',
                description: "This collection of poetry is as beautiful as the title implies, full of lyrical yet accessible language that unrelentingly fills you with feelings you didn't know you had until you read it",
                status: 'Not Exist',
                imgURL: 'https://www.mydomaine.com/thmb/d2uWYELuIcwaHm2_goDtH_1Gin8=/1865x2560/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9161zsTJi3L-185e288c564341888e3c1e0e781c3f30.jpg'
            }
        ]
    })
    yahia.save();
}
 seedInitialBooks();


server.get('/books', booksHandler)

function booksHandler(req, res) {
    let userEmail = req.query.email;
    userModel.find({ email: userEmail }, function (err, userData) {
        if (err) {
            console.log('did not work')
        } else {
            // console.log(userData);
            // console.log(userData[0].books);
            res.send(userData[0].books);
        }
    })
}



server.post('/addbook', addingBooks);

function addingBooks(req, res) {
    // console.log("its working")
    // console.log(req.body);

    const { email, newBookName, newDescription, newImg, newStatus } = req.body

    userModel.find({ email: email }, (err, addToData) => {
        if (err) {
            res.send('not working');
            console.log('not working');
        } else {
            // console.log('before pushing', addToData)
            addToData[0].books.push({
                name: newBookName,
                description: newDescription,
                status: newStatus,
                imgURL: newImg
            })
            // console.log('after pushing', addToData[0])
            addToData[0].save()
            res.send(addToData[0])
        }
    })

}

server.delete('/deleteBook/:index', deleteBook)
// app.delete('/deleteCat/:index',deleteCatHandler);

function deleteBook(req, res) {
    let email = req.query.email;
    let index = req.params.index

    // console.log('inside delete')
    // console.log(email, index);

    userModel.find({ email: email }, (err, data) => {
        const deleteFromData = data[0].books.filter((book, idx) => {
            if (index != idx) {
                return book
            }
        })
        data[0].books = deleteFromData
        data[0].save()
        res.send(data[0].books)
    })
}

server.put('/updateBook/:index', updateBook)

function updateBook(req, res) {
    console.log(req.body);

    const { bookName, bookDescription, imgURL, bookStatus, email } = req.body;
    let index = req.params.index




    userModel.findOne({ email: email }, (err, updatedData) => {
        // console.log(updatedData[0].books[index]);
        // updatedData[0].books[index]=req.body;
        // console.log(updatedData.books);

        updatedData.books.splice(index, 1, {
            name: bookName,
            description: bookDescription,
            status: bookStatus,
            imgURL: imgURL
        })
        updatedData.save();
        res.send(updatedData);
    })
}



server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})


