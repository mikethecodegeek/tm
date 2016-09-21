var express = require('express');
var router = express.Router();
var Messages = require('../models/messages');


router.get('/', (req,res)=> {
    Messages.find({})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.get('/adminbox', (req,res)=> {
    Messages.find({to: "admin"})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/userbox', (req,res)=> {
  console.log(req.body)
    Messages.find({to: req.body.user})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/read', (req,res)=> {
  console.log(req.body)
    // Messages.find({to: req.body.user})
    //     .exec((err, data) => err ? res.send(err) : res.send(data));
    Messages.findByIdAndUpdate(req.body.message,{$set: {status:"read"}}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});


router.post('/newmessage', (req,res)=> {
  console.log(req.body)
    Messages.create(req.body.message,(err, listing)=> {
        if (err){
            console.log(err);
            res.status(400).send(err)
        } else {
            res.status(200).send(listing);
        }
    });
});

router.get('/:id', (req,res)=> {
    Messages.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});


router.delete('/:id', (req,res)=> {
    Messages.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            Messages.find({})
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }
    });
});

router.put('/:id', (req,res)=> {
    Messages.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;
