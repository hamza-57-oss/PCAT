const express = require('express');

const app = express();

app.get('/',(req,res)=>{

  const photo={
    id:1,
    name:"Hamza",
    role:"admin"
  }
  res.send(user);
})

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});

