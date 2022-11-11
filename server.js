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
        let values = 'SELECT variable_4.value as nri, variable_3.value as avg FROM variable_4 INNER JOIN variable_3 ON variable_4.year==variable_3.year WHERE variable_4.year==?';
        let unitNRI = 'SELECT unit from Variables WHERE name=="National Rainfall Index (NRI)"';
        let unitAVG = 'SELECT unit from Variables WHERE name=="Long-term average annual precipitation in depth"';
        db.all(values, year, (err, rows) => {
            console.log(err);
            console.log(rows);
            console.log(template);
            let content = template.toString();
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%NRI_VALUE%%", rows[0].nri);
            content = content.replace("%%AVGTEMP_VALUE%%", rows[0].avg);
            
            db.all(unitNRI, (err, rows) => {
                console.log(err);
                console.log(rows);

                content = content.replace("%%NRI_UNIT%%", rows[0].unit);

                db.all(unitAVG, (err, rows) => {
                    console.log(err);
                    console.log(rows);

                    content = content.replace("%%AVGTEMP_UNIT%%", rows[0].unit);
                })
            })
            // NOTE: NRI only has data from 1965 - 2019
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
        });
    });
});

app.get('/capita/:yr', (req, res) => {
    console.log(req.params.yr);
    fs.readFile(path.join(template_dir, 'capita.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let values = 'SELECT variable_1.value as dam, variable_2.value as ratio, variable_8.value as renewable FROM variable_1 INNER JOIN variable_2 ON variable_1.year==variable_2.year INNER JOIN variable_8 on variable_2.year==variable_8.year WHERE variable_1.year==?';
        let unitDAM = 'SELECT unit from Variables WHERE name=="Dam capacity per capita"';
        let unitRATIO = 'SELECT unit from Variables WHERE name=="Dependency ratio"';
        let unitRENEW = 'SELECT unit from Variables WHERE name=="Total renewable water resources per capita"';

        
        let year = parseInt(req.params.yr);
        db.all(values, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%DAM_VALUE%%", values.dam);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%DEPENDRATIO_VALUE%%", values.ratio);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%WATER_CAPITA_VALUE%%", values.renewable);

            db.all(unitDAM, (err, rows) => {
                console.log(err);
                console.log(rows);

                content = content.replace("%%DAM_UNIT%%", rows[0].unit);

                db.all(unitRATIO, (err, rows) => {
                    console.log(err);
                    console.log(rows);

                    content = content.replace("%%DEPENDRATIO_UNIT%%", rows[0].unit);

                    db.all(unitRENEW, (err, rows) => {
                        console.log(err);
                        console.log(rows);
    
                        content = content.replace("%%WATER_CAPITA_UNIT%%", rows[0].unit);
                    })
                });
            });

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
        let values = 'SELECT variable_5.value as ground, variable_6.value as surface, variable_7.value as total FROM variable_5 INNER JOIN variable_6 ON variable_5.year==variable_6.year INNER JOIN variable_7 on variable_6.year==variable_7.year WHERE variable_5.year==?';
        let unitG = 'SELECT unit from Variables WHERE name=="Total renewable groundwater"';
        let unitS = 'SELECT unit from Variables WHERE name=="Total renewable surface water"';
        let unitT = 'SELECT unit from Variables WHERE name=="Total renewable water resources"';
        let year = parseInt(req.params.yr);
        db.all(values, [year], (err, rows) => {
            console.log(err);
            console.log(rows);
            let content = template.toString().replace("%%YEAR%%", year);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%GROUNDWATER_VALUE%%", rows[0].ground);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%SURFACEWATER_VALUE%%", rows[0].surface);
            content = content.replace("%%YEAR%%", year);
            content = content.replace("%%WATERRESOURCES_VALUE%%", rows[0].total);

            db.all(unitG, (err, rows) => {
                console.log(err);
                console.log(rows);

                content = content.replace("%%GROUNDWATER_UNIT%%", rows[0].unit);

                db.all(unitS, (err, rows) => {
                    console.log(err);
                    console.log(rows);

                    content = content.replace("%%SURFACEWATER_UNIT%%", rows[0].unit);

                    db.all(unitT, (err, rows) => {
                        console.log(err);
                        console.log(rows);
    
                        content = content.replace("%%WATERRESOURCES_UNIT%%", rows[0].unit);
                    })
                })
            })

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