const express = require('express');
const path = require('path');

const staticMiddleware = (app) => {
    // Use express.static to serve files from the 'public' folder
    app.use(express.static(path.join(__dirname, '../Public')));
};

module.exports = staticMiddleware;