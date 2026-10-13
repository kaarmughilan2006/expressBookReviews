const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(books[isbn]);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book",
            error: error.message
        });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.author &&
            book.author.toLowerCase().includes(author)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.title &&
            book.title.toLowerCase().includes(title)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(books[isbn].reviews || {});
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving reviews",
            error: error.message
        });
    }
});

module.exports.general = public_users;
