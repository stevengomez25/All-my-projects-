const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add',(req, res)=>{
    res.render('../views/links/add.hbs');
})

router.post('/add', async(req, res)=>{
    const {title,url,description} = req.body;
    const NewLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO link set ?', [NewLink]);
    req.flash('success','Successfully saved');
    res.redirect('/links');
})

router.get('/',async(req, res)=>{
    const links = await pool.query('SELECT * from link');
    console.log(links);
    res.render('links/list',{links});
});

router.get('/delete/:id', async(req, res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM link where id = ?', [id]);
    req.flash('success','Link successfully removed');
    res.redirect('/links');
})

router.get('/edit/:id', async(req, res)=>{
    const {id} = req.params;
    const links = await pool.query('SELECT * from link WHERE id = ?', [id]);
    res.render('links/edit',{links: links[0]});
})

router.post('/edit/:id', async(req, res)=>{
    const {id} = req.params;
    const {title, description, url} = req.body;
    const newLink = {
        title,
        description,
        url
    }
    await pool.query('UPDATE link set ? WHERE id = ?',[newLink,id]);
    req.flash('success','Link updated successfully');
    res.redirect('/links');
})

module.exports = router;