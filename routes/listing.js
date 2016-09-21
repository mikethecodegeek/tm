var express = require('express');
var router = express.Router();
var Listing = require('../models/listings');
var request = require('request');


router.get('/', (req,res)=> {
  console.log(req.body)
    Listing.find({})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.get('/alltasks', (req,res)=> {
  console.log(req.body)
    Listing.find({assignor:"Eddie"})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/name', (req,res)=> {
  console.log(req.body)
    Listing.find({assignee:req.body.name})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});
router.post('/starttask', (req,res)=> {
    console.log(req.body)
    Listing.findByIdAndUpdate(req.body.item._id,{$set: {status:'current', startdate:req.body.item.startdate}}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.post('/completetask', (req,res)=> {
    console.log(req.body)
    Listing.findByIdAndUpdate(req.body.item._id,{$set: {status:'complete', completed:req.body.item.completedate, completedate:req.body.item.completedate}}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});
router.post('/newlisting', (req,res)=> {
    console.log(req.body)
    Listing.create(req.body.item,(err, listing)=> err ? res.send(err) : res.send(listing));
});

router.post('/updatelisting', (req,res)=> {
    console.log(req.body)
    Listing.findByIdAndUpdate(req.body.item._id,{$set: req.body.item}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.post('/deletelisting', (req,res)=> {
    console.log(req.body.item._id)
    Listing.findByIdAndRemove(req.body.item._id, (err,data)=> err ? res.send(err) : res.send(data));
    // Listing.findByIdAndUpdate(req.body.item._id,{$set: req.body.item}, {new:true}, (err,data)=> {
    //     if (err){
    //         console.log(err);
    //     }
    //     else {
    //         res.send(data);
    //     }
    // });
});

router.get('/:id', (req,res)=> {
    Listing.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(listing));
});


router.delete('/:id', (req,res)=> {
    Listing.findByIdAndRemove(req.params.id, (err,data)=> err ? res.send(err) : res.send(data));
});

router.put('/:id', (req,res)=> {
    Listing.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;
