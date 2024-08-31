const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const routes = require('./routes');
const routes_default = require('./routes-def');



app.use(express.json());
app.use('/users', routes);
app.use('/', routes_default);

app.listen(port, () => {m
  console.log(`Server running on port ${port}`);
});
