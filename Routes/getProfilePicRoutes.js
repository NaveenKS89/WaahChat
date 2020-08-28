const fs = require('fs')
const stream = require('stream')
const router = require('express').Router();
const { Path } = require('path-parser');
const {URL} = require('url');
//const path = require('path');


module.exports = app => {
    app.get('/userprofilepic/:imgName',(req, res) => {
        /* Don't use this below comment it is giving error as there is no data in req.body.url
        const p = new Path('/userprofilepic/:imgName');
        const url = new URL(req.body.url).pathname;
        const match = p.match(new URL(req.body.url).pathname);
        */
       
        let imgName = req.params.imgName;
        /*
        var options = {
            root: path.join(__dirname, '../public'),
            dotfiles: 'deny'
        };

        res.sendFile(imgName, options, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Sent:', imgName)
            }
          });
        */

        const r = fs.createReadStream(`./public/${imgName}`); // or any other way to get a readable stream
        const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
        stream.pipeline(
        r,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
        if (err) {
        console.log(err) // No such file or any other kind of error
        return res.sendStatus(400); 
        }
        });
        ps.pipe(res); // <---- this makes a trick with stream error handling
    });
};
