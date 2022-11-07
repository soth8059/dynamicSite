// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'data.sqlite3'); // <-- change this

let app = express();
let port = 8000;

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});

// Serve static files from 'public' directory
app.use(express.static(public_dir));


// GET request handler for home page '/' (redirect to desired route)
app.get('/precipitation/:yr', (req, res) => {
    console.log(req.params.yr);
    fs.readFile(path.join(template_dir, 'precipitation.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, Cereals.protein, Cereals.fat,\
        Cereals.rating FROM Variables INNER JOIN Manufacturers ON Manufacturers.id = Cereals.mfr WHERE Cereals.mfr = ?';
        let year = req.params.yr;
        db.all(query, year, (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.toString().replace("%%YEAR%%", year);
            content = content.toString().replace("%%YEAR%%", year);
            content = content.replace("%%NRI_VALUE%%", query.value);
            content = content.replace("%%AVGTEMP_VALUE%%", query.value);
            let minus = year -1;
            let plus = year +1;
            if(minus < 1961){
                minus = year+58;
            }
            if(plus > 2019){
                plus = year-58;
            }
            content = content.replace("%%MINUS%%", minus);
            content = content.replace("%%PLUS%%", plus);

            //content = content.replace("%%IMG%%", "/images/" + req.params.mfr.toUpperCase() + "_logo.png");
            res.status(200).type('html').send(content);
        });
    });
});

app.get('/capita/:yr', (req, res) => {
    console.log(req.params.yr);
    fs.readFile(path.join(template_dir, 'capita.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, Cereals.protein, Cereals.fat,\
        Cereals.rating FROM Variables INNER JOIN Manufacturers ON Manufacturers.id = Cereals.mfr WHERE Cereals.mfr = ?';
        let year = req.params.yr;
        db.all(query, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%DAM_VALUE%%", rows[0].value);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%DEPENDRATIO_VALUE%%", query.value);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%RENEWABLE_WATER_VALUE%%", info);
            let minus = year -1;
            let plus = year +1;
            if(minus < 1961){
                minus = year+58;
            }
            if(plus > 2019){
                plus = year-58;
            }
            content = content.replace("%%MINUS%%", minus);
            content = content.replace("%%PLUS%%", plus);
            res.status(200).type('html').send(content);
        });
    });
});

app.get('/renewable/:yr', (req, res) => {
    console.log(req.params.yr);
    fs.readFile(path.join(template_dir, 'renewable.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, Cereals.protein, Cereals.fat,\
        Cereals.rating FROM Variables INNER JOIN Manufacturers ON Manufacturers.id = Cereals.mfr WHERE Cereals.mfr = ?';
        let year = req.params.yr;
        db.all(query, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%GROUND_WATER_VALUE%%", rows[0].value);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%SURFACE_WATER_VALUE%%", query.value);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%WATER_RESOURCES_VALUE%%", info);
            let minus = year -1;
            let plus = year +1;
            if(minus < 1961){
                minus = year+58;
            }
            if(plus > 2019){
                plus = year-58;
            }
            content = content.replace("%%MINUS%%", minus);
            content = content.replace("%%PLUS%%", plus);
            res.status(200).type('html').send(content);
        });
    });
});

/*
// Example GET request handler for data about a specific year
app.get('/year/:selected_year', (req, res) => {
    console.log(req.params.selected_year);
    fs.readFile(path.join(template_dir, 'year.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database

        res.status(200).type('html').send(template); // <-- you may need to change this
    });
});*/

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
