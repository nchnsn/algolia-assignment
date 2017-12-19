

// CONVERT CSV TO JSON

//require the csvtojson converter class 
var Converter = require("csvtojson").Converter;
const fs = require('fs');



// CONVERT CSV to OBJ
var file = 'input.csv'
var csvObj = {}
fs.readFile(file, function(err, obj) {
    var testing = [];
    testing.push(obj);
    testing = testing.toString('utf8').split("\n");
    testing.map(function(element, index){        
        csvObj[element.split(';')[0]] = { 
            food_type:element.split(';')[1],
            stars_count:element.split(';')[2],
            reviews_count:element.split(';')[3],
            neighborhood:element.split(';')[4],
            phone_number:element.split(';')[5],
            price_range:element.split(';')[6],
            dining_style:element.split(';')[7]
        };
    });
})


// IMPORT EXISTING JSON DATA
var obj;
var updatedObj;
require('fs').readFile('restaurants_list.json', 'utf8', function (err, data) {
   console.log('converting json');
    if (err) {
        console.log('error');
    }
       // error handling
    obj = JSON.parse(data);
    console.log('data...');
    // console.log(obj);
    console.log(obj[0]['objectID']);
    obj.map(function(element, index){
        console.log('mapping new data');
        // creating a refference to find that object ID in the csv data
        var csvData = csvObj[element['objectID']];
        element.food_type = csvData.food_type;
        element.stars_count = csvData.stars_count;
        element.reviews_count = csvData.reviews_count;
        element.neighborhood = csvData.neighborhood;
        element.phone_number = csvData.phone_number;
        element.price_range = csvData.price_range;
        element.dining_style = csvData.dining_style;
        
    // Export final json obect to a json file 
    });
   fs.writeFile('updatedInfo.json', JSON.stringify(obj), 'utf8');
}

);

