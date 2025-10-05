const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Veritabanına bağlan
mongoose.connect('mongodb://localhost/pcat-test-db')
  .then(() => {
    console.log('MongoDB bağlantısı başarılı!');
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

// Schema oluştur
const PhotoSchema = new Schema({
  baslik: String,
  aciklama: String,
});

// Model oluştur
const Photo = mongoose.model('Photo', PhotoSchema);

// CRUD işlemleri

// CREATE
Photo.create({
  baslik: "Photo 1",
  aciklama: "Photo aciklama"
})
.then(newPhoto => {
  console.log("Eklenen foto:", newPhoto);

  // UPDATE
  const id = newPhoto._id; // Eklenen kaydın id’sini kullanalım
  return Photo.findByIdAndUpdate(
    id,
    {
      baslik: "Photo 1 güncellendi.",
      aciklama: "Photo aciklama güncellendi."
    },
    { new: true }
  );
})
.then(updatedPhoto => {
  if (updatedPhoto) {
    console.log("Güncellenen kayıt:", updatedPhoto);
  } else {
    console.log("Bu ID ile kayıt bulunamadı!");
  }

  // READ
  return Photo.find({});
})
.then(data => {
  console.log("Tüm fotoğraflar:", data);

  // DELETE
  const id = data[0]._id;
  return Photo.findByIdAndDelete(id);
})
.then(deletedPhoto => {
  if (deletedPhoto) {
    console.log("Silinen kayıt:", deletedPhoto);
  } else {
    console.log("Silinecek kayıt bulunamadı!");
  }
})
.catch(err => {
  console.log("İşlem hatası:", err.message);
})
.finally(() => {
  mongoose.connection.close();
});
