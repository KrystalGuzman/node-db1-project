const express = require('express');

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get('/', (req, res) => {
    var { limit } = req.body;
    var { sortBy } = req.body;
    var { sortDir } = req.body;
    let query = db("accounts");

    if(!limit){
        limit = 10
    }
    if(!sortBy){
        sortBy = 'id'
    }
    if(!sortDir){
        sortDir = 'asc'
    }

  db("accounts").orderBy(sortBy, sortDir).limit(limit)
    .then(accounts => res.status(200).json(accounts))
    .catch(err =>
      res.status(500).json({ errorMessage: "Error fetching accounts" })
    );
});


router.get('/:id', (req, res) => {
    
    db("accounts")
    .where({id: req.params.id})
    .first()
    .then(response => {
        console.log("GET /:id response:", response);

        if (response)
            { res.status(200).json({ data: response }); }
        else
            { res.status(404).json({message: "No account with id " + req.params.id + " found."}); }
    })
    .catch(error => {
        console.log("GET /:id error:", error);
        res.status(500).json({message: "GET /:id failed."});
    })

});

router.post('/', (req, res) => {

    if (!req.body || !req.body.name || !req.body.budget)
        { res.status(400).json({message: "Both name and budget are required."}); }

    db("accounts")
    .insert(req.body)
    .then(response => {
        console.log("POST / response:", response);

        if (response.length > 0)
            { res.status(201).json({results: response}); }
        else
            { res.status(404).json({message: "POST error"}); }
    })
    .catch(error => {
        console.log("POST / error:", error);
        res.status(500).json({message: "POST / failed."});
    })
});

router.put('/:id', (req, res) => {

    db("accounts")
    .where({id: req.params.id})
    .update(req.body)
    .then(numberUpdated => {
        console.log("PUT /:id response:", numberUpdated);

        if (numberUpdated > 0)
            { res.status(200).json({ message: 'record updated successfully'}); }
        else
            { res.status(404).json({message: "No account with id " + req.params.id + " found."}); }
    })
    .catch(error => {
        console.log("PUT /:id error:", error);
        res.status(500).json({message: "PUT /:id failed."});
    })
});

router.delete('/:id', (req, res) => {

    db("accounts")
    .where({id: req.params.id})
    .del()
    .then(numberDeleted => {
        console.log("DELETE /:id response:", numberDeleted);

        if (numberDeleted > 0)
            { res.status(200).json({ message: 'record deleted successfully'}); }
        else
            { res.status(404).json({message: "No account with id " + req.params.id + " found."}); }
    })
    .catch(error => {
        console.log("DELETE /:id error:", error);
        res.status(500).json({message: "DELETE /:id failed."});
    })
});

module.exports = router;