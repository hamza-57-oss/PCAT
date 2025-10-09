const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const PhotoController = require('./controllers/photoControllers');
const pagecontroller = require('./controllers/pagecontroller');
const userController = require('./controllers/usercontroller');
const { authenticateUser, redirectIfAuthenticated, setUserLocals } = require('./middlewares/authMiddleware');

const app = express();

// Veritabanına bağlan
mongoose.connect('mongodb://localhost/pcat-test-db');

app.set('view engine', 'ejs');

// SESSION AYARLARI (MIDDLEWARE'lerden önce )
app.use(session({
  secret: 'KKD kullanımı hayat kurtarır', // Güvenlik anahtarı (şifreleme için)
  resave: false, // Her istekte oturumu yeniden kaydetme
  saveUninitialized: false, // Boş oturumları kaydetme
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/pcat-test-db' // Oturumlar MongoDB’de saklanacak
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // Oturum süresi: 7 gün
  }
}));

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
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(setUserLocals); // Her sayfada kullanıcı bilgisini kullanabilmek için


// ROUTES

// Ana sayfa - GİRİŞ YAPMAYANLAR İÇİN
app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login'); // Giriş yapmamışsa login'e yönlendir
  }
  // Giriş yapmışsa fotoğrafları göster
  PhotoController.getAllPhotos(req, res);
});
// Fotoğraf detay - sadece giriş yapanlar
app.get('/photos/:id', authenticateUser, PhotoController.getPhoto);

// Fotoğraf işlemleri - sadece giriş yapanlar
app.post('/photos', authenticateUser, upload.single('image'), PhotoController.createPhoto);
app.put('/photos/:id', authenticateUser, PhotoController.updatePhoto);
app.delete('/photos/:id', authenticateUser, PhotoController.deletePhoto);

// Sayfa routes
app.get('/add', authenticateUser, pagecontroller.getAddPage);
app.get('/photos/edit/:id', authenticateUser, pagecontroller.getEditPage);

// Kullanıcı routes
app.get('/register', redirectIfAuthenticated, pagecontroller.getRegisterPage);
app.post('/register', redirectIfAuthenticated, userController.createUser);
app.get('/login', redirectIfAuthenticated, pagecontroller.getLoginPage);
app.post('/login', redirectIfAuthenticated, userController.loginUser);
app.get('/logout', userController.logoutUser);


// Sayfa routes
app.get('/about', pagecontroller.getAboutPage);
app.get('/add', authenticateUser, pagecontroller.getAddPage); // Sadece giriş yapanlar
app.get('/photos/edit/:id', authenticateUser, pagecontroller.getEditPage); // Sadece giriş yapanlar

// Kullanıcı routes
app.get('/register', redirectIfAuthenticated, pagecontroller.getRegisterPage);
app.post('/register', redirectIfAuthenticated, userController.createUser);
app.get('/login', redirectIfAuthenticated, pagecontroller.getLoginPage);
app.post('/login', redirectIfAuthenticated, userController.loginUser);
app.get('/logout', userController.logoutUser);

const port = 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});