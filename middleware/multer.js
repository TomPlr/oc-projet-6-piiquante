const multer = require('multer');

const EXTENSIONS = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    console.log(file.originalname);
    const name = file.originalname.replaceAll(' ', '_').split('.')[0];
    const extension = EXTENSIONS[file.mimetype];

    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage }).single('image');
