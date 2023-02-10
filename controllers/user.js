const User = require('../models/user');
const bcrypt = require('bcrypt');
const PasswordValidator = require('password-validator');
const EmailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

let passwordSchema = new PasswordValidator();

passwordSchema
  .is()
  .min(8, 'Le mot de passe doit comporter minimum 8 caractères')
  .has()
  .uppercase(1, 'Veuillez utiliser au moins 1 majuscule')
  .has()
  .lowercase(1, 'Veuillez utiliser au moins 1 minuscule')
  .has()
  .digits(2, 'Veuillez utiliser au moins 2 chiffres')
  .is()
  .not()
  .oneOf(['Azerty12', '123456Az'], 'Mot de passe trop faible !');

exports.signup = (req, res) => {
  if (!EmailValidator.validate(req.body.email)) {
    return res.status(400).json({ message: 'Email incorrect !' });
  } else if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json(new Error('Mot de passe incorrect'));
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => {
            res.status(201).json({ message: 'User created!' });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: 'Authentication issue ❌ !' });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: 'Authentication issue ❌ !' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
                  expiresIn: '24h',
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
