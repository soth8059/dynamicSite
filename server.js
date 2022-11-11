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
        let year = parseInt(req.params.yr);
        let nri = 'SELECT * from variable_4 WHERE year==?';
        let unitNRI = 'SELECT unit from Variables WHERE name=="National Rainfall Index (NRI)"';
        let avg = 'SELECT * from variable_3 WHERE year==?';
        let unitAVG = 'SELECT unit from Variables WHERE name=="Long-term average annual precipitation in depth"';
        db.all(nri, unitNRI, avg, unitAVG, year, (err, rows) => {
            console.log(err);
            console.log(rows);
            console.log(template);
            let content = template.toString();
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%NRI_VALUE%%", nri.value + unitNRI);
            content = content.replace("%%AVGTEMP_VALUE%%", avg.value + unitAVG);
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
        let dam = 'SELECT * from variable_1 WHERE year==?';
        let unitDAM = 'SELECT unit from Variables WHERE name=="Dam capacity per capita"';
        let ratio = 'SELECT * from variable_2 WHERE year==?';
        let unitRATIO = 'SELECT unit from Variables WHERE name=="Dependency ratio"';
        let renew = 'SELECT * from variable_8 WHERE year==?';
        let unitNEW = 'SELECT unit from Variables WHERE name=="Total renewable water resources per capita"';

        
        let year = parseInt(req.params.yr);
        db.all(query, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%DAM_VALUE%%", dam.value + unitDAM);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%DEPENDRATIO_VALUE%%", ratio.value + unitRATIO);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%RENEWABLE_WATER_VALUE%%", renew.value + unitNEW);
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
        let ground = 'SELECT * from variable_5 WHERE year==?';
        let unitG = 'SELECT unit from Variables WHERE name=="Total renewable groundwater"';
        let surface = 'SELECT * from variable_6 WHERE year==?';
        let unitS = 'SELECT unit from Variables WHERE name=="Total renewable surface water"';
        let water = 'SELECT * from variable_7 WHERE year==?';
        let unitW = 'SELECT unit from Variables WHERE name=="Total renewable water resources"';
        let year = parseInt(req.params.yr);
        db.all(query, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%GROUND_WATER_VALUE%%", ground.value + unitG);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%SURFACE_WATER_VALUE%%", surface.value + unitS);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%WATER_RESOURCES_VALUE%%", water.value + unitW);
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
