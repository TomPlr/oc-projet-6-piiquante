const Sauce = require('../models/sauce');
const fs = require('fs');

exports.showSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(401).json({ message: 'showSauces error ❌ : ' + error })
    );
};

exports.showOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((Sauce) => res.status(200).json(Sauce))
    .catch((error) =>
      res.status(404).json({ message: 'showSauces error ❌ : ' + error })
    );
};

exports.createSauce = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce);
  const newSauce = new Sauce({
    ...sauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  newSauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce created' }))
    .catch((error) =>
      res.status(400).json({ message: 'createSauce error ❌ : ' + error })
    );
};

exports.modifySauce = (req, res, next) => {
  let modifiedSauce;

  Sauce.findById(req.params.id)
    .then((sauce) => {
      const fileName = sauce.imageUrl.split('/images/')[1];

      if (req.file) {
        fs.unlink(`images/${fileName}`, (error) => {
          console.log(error);
        });

        modifiedSauce = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        };
      } else {
        modifiedSauce = { ...req.body };
      }

      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non-authorized' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...modifiedSauce })
          .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non-authorized' });
      } else {
        const fileName = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {};
