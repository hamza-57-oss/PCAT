// controllers/userController.js
const User = require('../models/user');

// Kayıt işlemi
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).render('register', {
        error: 'Bu email veya kullanıcı adı zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password
    });

    // Kullanıcıyı otomatik giriş yaptır
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('register', {
      error: 'Kayıt sırasında bir hata oluştu'
    });
  }
};

// Giriş işlemi
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render('login', {
        error: 'Email veya şifre hatalı'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).render('login', {
        error: 'Email veya şifre hatalı'
      });
    }

    // Session'a kaydet
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('login', {
      error: 'Giriş sırasında bir hata oluştu'
    });
  }
};

// Çıkış işlemi
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};