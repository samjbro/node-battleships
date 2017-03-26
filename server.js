import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.use('/public', express.static('public'));
app.use('/bower_components', express.static('bower_components'));

app.get('/', (req,res) => res.render('index'));

app.listen(3000);
