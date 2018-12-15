const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const authRoutes = express.Router();

/* CREATE nuevo user */
authRoutes.post('/signup', (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;
  
  if(!firstName || !lastName || !email || !username || !password) {
    res.status(400).json({ message: 'Indica un nombre de usuario y una contraseña' });
    return;
  }
  //Comprobar si usuario ya existe
  User.findOne({ username }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'El nombre de usuario ya existe' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashPass
    });
    console.log(theUser)
    theUser.save()
      .then(user => {
        req.login(user, (err) => {
          if (err) {
            res.status(500).json({message: 'Algo salio mal'});
          }
          res.status(200).json(req.user);
        })
        .catch(err => res.status(400).json({message: 'Algo salio  mal'}));
      })
  });
});

/* POST para hacer login */
authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Algo salio mal' });
      return;
    }

    if(!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Algo salio mal' });
        return;
      }

      res.status(200).json(req.user);
      console.log('estoy haciendo login')
    });
  })(req, res, next);
})

/* POST para cerrar sesión */
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Cierre de sesión con exito'});
})

/* GET para comprobar si user esta logueado */
authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
})

module.exports = authRoutes;
