const express = require('express')
const app = express()
const port = 3001
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://duolingomaster_rw:ThieThiex4@pgsql.hrz.tu-chemnitz.de/duolingomaster')
var cors = require('cors')

app.use(cors())
app.use(express.json())

// insert values into novelty, visual_storytelling, curiosity and acknowledgement
app.patch('/:post_id', (req, res)=>{
    db.oneOrNone('UPDATE post SET novelty=$1, visual_storytelling=$2, curiosity=$3, acknowledgement=$4 WHERE post_id=$5;', [req.body.novelty, req.body.visual_storytelling, req.body.curiosity, req.body.acknowledgement, req.params.post_id])
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.patch('/:post_id/:user', (req, res)=>{
  db.oneOrNone('INSERT INTO post_classification (post_id, classified_by, novelty, visual_storytelling, curiosity, acknowledgement) VALUES ($1, $2, $3, $4, $5, $6);', [req.params.post_id, req.params.user, req.body.novelty, req.body.visual_storytelling, req.body.curiosity, req.body.acknowledgement])
  .then((data) => {
    console.log('DATA:', data)
    res.send(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).send('error')
  })
})

app.get('/random_post', (req, res)=>{
    db.one('SELECT * FROM post WHERE visual_storytelling IS NULL ORDER BY random() LIMIT 1;')
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.get('/all_users', (req, res)=>{
  db.many('SELECT * FROM user;')
  .then((data) => {
    console.log('DATA:', data)
    res.send(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).send('error')
  })
})

app.get('/:user/count_submitted', (req, res)=>{
  db.oneOrNone('SELECT COUNT(*) FROM post_classification WHERE classified_by=$1;', [req.params.user])
  .then((data) => {
    console.log('DATA:', data)
    res.send(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
    res.status(500).send('error')
  })
})

app.get('/count_coded_posts', (req, res)=>{
    db.one('SELECT count(*) FROM post WHERE visual_storytelling IS NOT NULL;')
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.get('/:post_id', (req, res)=>{
    db.one('SELECT * FROM post WHERE post_id=$1;', [req.params.post_id])
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.get('/image/:post_id', (req, res)=>{
    db.many('SELECT * FROM image WHERE post_id=$1;', [req.params.post_id])
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.get('/', (req, res) => {
    db.one('SELECT * FROM post LIMIT 1')
    .then((data) => {
      console.log('DATA:', data)
      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.status(500).send('error')
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
