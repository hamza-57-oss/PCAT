const Photo = require('../models/photo');
exports.getAboutPage=  (req, res) => {
  res.render('about', { photos: [] });
};

exports.getAddPage=  (req, res) => {
  res.render('add', { photos: [] });
};

exports.getEditPage=  async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('edit', { photo });
};


    