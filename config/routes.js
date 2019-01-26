require('dotenv/config')
const {server} = require('../api/server.js')
const express = require('express')
const knex = require('knex')
const axios = require('axios');
const bcrypt = require('../node_modules/bcryptjs')
const dbConfig = require('../knexfile.js')

const db = knex(dbConfig[process.env.DEV])
const jwt = require('jsonwebtoken')
const { authenticate } = require('../auth/authenticate');
const secret = "gold";

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function generateToken(user) {

  const payload = {
    username: user.username
  }

  const options = {
    expiresIn: '10min',
    jwtid:'4040'
  }

  return jwt.sign(payload,secret,options)
}

function register(req, res) {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password,16)

    db('users').insert(user)
      .then(ids => {
        const id = ids[0];
        db('users')
        .where({id})
        .first()
        .then(user => {
          const token = generateToken(user);

          res.status(201).json({message: `user ${user.username} added`, id: user.id, token})
        })
        .catch(err => {
          res.status(500).json({message: `Could not add user! ${err}`})
        })
      })
}

function login(req, res) {
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
