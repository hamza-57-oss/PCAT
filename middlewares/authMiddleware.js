
// Kullanıcı giriş yapmış mı kontrol et
exports.authenticateUser = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Kullanıcı zaten giriş yapmışsa login/register sayfasına gitmesin
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};

// Tüm sayfalarda kullanıcı bilgisini kullanabilmek için
exports.setUserLocals = (req, res, next) => {
  res.locals.currentUser = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username
  } : null;
  next();
};