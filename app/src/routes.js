const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/health', (req, res) => {
  try { 
    console.log({patch: req.originalUrl, method: req.method});
    res.json({status: "OK"});    
  } catch (error) {
    console.log(error);
    res.status(500).json({error : error})
  }  
});


// Получение всех пользователей
router.get('/', (req, res) => {
  try {
    console.log({patch: req.originalUrl, method: req.method});
     db.query('SELECT * FROM users', (err, results) => {
     res.json(results);
    });  
  } catch (error) {
     console.log(error);
     res.status(500).json({error : error})
  }  
});

// Создание пользователя
router.post('/', (req, res) => {
  const { name, email } = req.body;
  try {
    console.log({patch: req.originalUrl, method: req.method});
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    res.json({ id: result.insertId, name, email });
  });
} catch (error) {
  console.log(error);
  res.status(500).json({error : error})
}  
});

// Обновление пользователя
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    console.log({patch: req.originalUrl, method: req.method});
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
    res.json({ id, name, email });
    
  });
} catch (error) {
  console.log(error);
  res.status(500).json({error : error})
}  
});

// Удаление пользователя
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {    
    console.log({patch: req.originalUrl, method: req.method});
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) throw err;
      res.json({ message: 'User deleted' });
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({error : error})
  }  
});

module.exports = router;

