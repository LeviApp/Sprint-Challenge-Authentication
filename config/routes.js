require('dotenv/config')
const {server} = require('../api/server.js')
const express = require('express')
const knex = require('knex')
const axios = require('axios');
const bcrypt = require('bcrypt')
const dbConfig = require('../knexfile.js')

const db = knex(dbConfig[process.env.DEV])
const jwt = require('jsonwebtoken')
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {

}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
