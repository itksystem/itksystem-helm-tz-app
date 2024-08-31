const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {      
     res.json({status: "OK"});    
     console.log({status: "OK"});
  } catch (error) {
    console.log(error);
    res.status(500).json({error : error})
  }  
});


module.exports = router;

