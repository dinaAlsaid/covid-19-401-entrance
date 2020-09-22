'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const methodOverride = require('method-override');
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

app.get('/', mainFunc);
app.post('/getCountryResult', countryResultFunc);
app.get('/allCountries', allCountriesFunc);
app.post('/Record', RecordFunc);
app.get('/myRecords', myRecordsFunc);

function mainFunc(req,res){
    let url = 'https://api.covid19api.com/world/total';
    superagent(url).then((results)=>{
        res.render('index',{confirmed: results.body.TotalConfirmed,
             deaths: results.body.TotalDeaths ,
             recovered: results.body.TotalRecovered});
    })
}
function countryResultFunc(req,res){
    let {country , start , end} = req.body;
    let url =`https://api.covid19api.com/country/${country}/status/confirmed?from=${start}&to=${end}`

    superagent(url).then((results)=>{
        res.render('countryResult',{countryRes:results.body});
    })
}
function allCountriesFunc(req,res){
    let url ='https://api.covid19api.com/summary';

    superagent(url).then((results)=>{
        let statArr= results.body.Countries.map((item)=> new CountryStat(item));
        res.render('allCountries',{statArr:statArr});
    })
}
function RecordFunc(req,res){
    let {country, code, conf, deaths ,recovered, date}=req.body;
    let safeVals=[country, code, conf, deaths ,recovered, date];
    let sql = 'INSERT INTO covid (country, code, confirmed_cases, deaths ,total_recovered, date) VALUES($1,$2,$3,$4,$5,$6);'
    console.log(req.body);
    client.query(sql,safeVals)
    .then(()=>{
        res.redirect('/myRecords');
    })
}
function myRecordsFunc(req,res){
    res.render('')
}

function CountryStat (data){
    this.country=data.Country
    this.code=data.CountryCode
    this.confirmed_cases=data.TotalConfirmed
    this.deaths=data.TotalDeaths
    this.total_recovered=data.TotalRecovered
    this.date=data.Date
}
client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`port ${PORT}`);
    })
})