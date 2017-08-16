var client = require('http-api-client');
var d3 = require("d3");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("data.sqlite");


 
var start =  "2017-03-27T16:45:30.220069+03:00"
console.log("старт: "+start); 
var p=0; var p2=0;

function piv(){  
p++;
client.request({url: 'https://public.api.openprocurement.org/api/2.3/contracts?offset='+start})
      .then(function (data) {
		var dataset = data.getJSON().data;
		start = data.getJSON().next_page.offset;			
		console.log(start)
		return dataset;
	})	
	.then(function (dataset) {			
		dataset.forEach(function(item) {
		client.request({url: 'https://public.api.openprocurement.org/api/2.3/contracts/'+item.id})
		.then(function (data) {	
//////////SQLite//////////////
var change = data.getJSON().data.changes[data.getJSON().data.changes.length-1].rationaleTypes[0];
var changeLength = data.getJSON().data.changes.length;
			

			
//console.log(changeLength)		
			
			
		
//if(changeLength>0){

	var up=0;var down=0;
	for (var p = 0; p < changeLength; p++) {
		if(data.getJSON().data.changes[p].rationaleTypes[0]=="itemPriceVariation"){
			up=up+1;
		}
		if(data.getJSON().data.changes[p].rationaleTypes[0]=="priceReduction"){
			down=down+1;
		}
	}
	
	var upDate="";var downDate="";
	for (var p = 0; p < changeLength; p++) {
		if(data.getJSON().data.changes[p].rationaleTypes[0]=="itemPriceVariation"){
			upDate = upDate+";"+data.getJSON().data.changes[p].dateSigned
		}
		if(data.getJSON().data.changes[p].rationaleTypes[0]=="priceReduction"){
			downDate = downDate+";"+data.getJSON().data.changes[p].dateSigned
		}
		
	}
			
console.log(upDate)	
	if(data.getJSON().data.changes[0].rationaleTypes[0]=="itemPriceVariation")
		{
			var first = data.getJSON().data.changes[0].dateSigned;
		}
 	
	var tender_id = data.getJSON().data.tender_id;
	var id = data.getJSON().data.id;		
	var lotIdContracts = data.getJSON().data.items[0].relatedLot;
	var dateSigned = data.getJSON().data.dateSigned;
	var amount = data.getJSON().data.value.amount;	
	
	client.request({url: 'https://public.api.openprocurement.org/api/2.3/tenders/'+data.getJSON().data.tender_id})
		.then(function (data) {
		var startAmount;
		if(data.getJSON().data.lots==undefined){
		startAmount = data.getJSON().data.value.amount;
		//console.log(startAmount)
		}
		else {
		for (var i = 1; i <= data.getJSON().data.lots.length; i++) {
		if(lotIdContracts==data.getJSON().data.lots[data.getJSON().data.lots.length-(i)].id){
		startAmount =  data.getJSON().data.lots[data.getJSON().data.lots.length-(i)].value.amount
		};			
	   }
	   
	//console.log(startAmount)
	}
	/*
	db.serialize(function() {	
	db.run("CREATE TABLE IF NOT EXISTS data (dateModified TEXT,dateSigned TEXT,first TEST,tender_id TEXT,id TEXT,tenderID TEXT,procuringEntity TEXT,numberOfBids INT,startAmount INT,amount INT,cpv TEXT,up INT,down INT)");
	var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"); 	
	statement.run(item.dateModified,dateSigned,first,tender_id,id,data.getJSON().data.tenderID,data.getJSON().data.procuringEntity.name,data.getJSON().data.numberOfBids,startAmount,amount,data.getJSON().data.items[0].classification.description,up,down);
	//console.log(change);
	statement.finalize();
	});
	*/
	})
	.catch(function  (error) {								
	});  
	//}
			
//////////SQLite//////////////	
	})
	.catch(function  (error) {
		//console.log("error_detale2")				
	});  
	});	
	})
	.catch(function  (error) {
		//console.log("error_detale3")				
	})
	.then(function () {	
		if (p<4) {
		//piv ();
		setTimeout(function() {piv ();},15000);
		}	
		else {
		console.log("STOP")
		//console.log(start.replace(/T.*/, ""))
		}							
		})
	.catch( function (error) {
		console.log("error")
		piv ();
	});   					
}

piv ();	