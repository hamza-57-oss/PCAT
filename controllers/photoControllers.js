const Photo = require('../models/photo');
const fs = require('fs');


exports.getAllPhotos= async (req, res) => {

  // URL'den sayfa numarasını al, yoksa 1. sayfayı göster
  const page=req.query.page || 1;
  
  // Her sayfada kaç fotoğraf gösterileceğini belirle
  const photosPerPage =3;
  
  // Veritabanındaki TOPLAM fotoğraf sayısını bul
  // countDocuments() → tüm fotoğrafları sayar
  const totalPhotos= await Photo.find().countDocuments();
  
  // Veritabanından fotoğrafları getir
  const photos = await Photo.find({})
  .skip((page-1)*photosPerPage)      // İlk X fotoğrafı atla (önceki sayfalar için)
  .limit(photosPerPage)              // Sadece 3 fotoğraf getir
  
  // index.ejs sayfasını render et ve verileri gönder
   res.render('index', {
    photos: photos,                              // Gösterilecek fotoğraflar
    current:page,                                // Şu anki sayfa numarası
    pages: Math.ceil(totalPhotos /photosPerPage) // Toplam sayfa sayısı (yukarı yuvarla)
   });
}

  
exports.getPhoto= async(req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { photo });
 
};

exports.createPhoto=  async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).send('Lütfen bir resim seçin!');
    }
    
    await Photo.create({
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename
    });
    
    res.redirect('/');
  } catch (error) {
    console.error('HATA DETAYI:', error);
    res.status(500).send(`Hata: ${error.message}`);
  }
};

exports.updatePhoto= async (req,res)=>{
  const photo = await Photo.findById(req.params.id);
    
photo.title = req.body.title;
photo.description = req.body.description;

await photo.save();
res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto= async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    
fs.unlinkSync('./public/uploads/' + photo.image);

await Photo.findByIdAndDelete(req.params.id);
res.redirect('/');
  }