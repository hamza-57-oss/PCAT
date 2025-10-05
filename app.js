const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');

const PhotoController= require ('./controllers/photocontrollers');
const pagecontroller= require('./controllers/pagecontroller');

const app = express();

//Veritabanına bağlan
mongoose.connect('mongodb://localhost/pcat-test-db');

app.set('view engine', 'ejs');

// MULTER AYARLARI
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(methodOverride('_method', {
  methods:['POST','GET']}
));

//ROUTES
app.get('/',PhotoController.getAllPhotos );
app.get('/photos/:id',PhotoController.getPhoto );
app.post('/photos', upload.single('image'), PhotoController.createPhoto);
app.put('/photos/:id', PhotoController.updatePhoto);
app.delete('/photos/:id', PhotoController.deletePhoto );

app.get('/about', pagecontroller.getAboutPage);
app.get('/add', pagecontroller.getAddPage);
app.get('/photos/edit/:id', pagecontroller.getEditPage);



//  Fotoğraf düzenleme sayfasını göster
app.get('/photos/edit/:id', );

// Fotoğraf güncelleme işlemi
app.put('/photos/:id', PhotoController.updatePhoto);

  

const port = 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});