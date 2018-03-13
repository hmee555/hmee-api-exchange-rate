// must intall this package
// npm install pm2 -g *** OR *** npm install pm2@latest -g 
// npm install request
// npm install jsftp

//----------------------------------------------------------------------------------------
var request = require('request');
var querystring = require('querystring');
var fs = require('fs');
var filename;
var d;
var month;
var day;
var year;
var strJson;
var arrCurr;
var fileCurr //= './curr.json';
var arrListCurr = [];
var strFinal;
var dirPath;
var fullPath;
var ctrlPath;
var ctrlName;
var strNull;

// Read File Currency
module.exports = function () {
	
	// Set Rate
	fileCurr = '/Nodejs/exchange_rate/curr.json';
	
	//---------------------------------------------------------------------
	
	// Set Date
	d = new Date();
	d.setDate(d.getDate() - 1);
	
	month = '' + (d.getMonth() + 1),
	day = '' + (d.getDate()),
	year = d.getFullYear();
		
	if (day.length < 2) day = '0' + day;
	if (month.length < 2) month = '0' + month;

		console.log("Send date = "  + year + "-" + month + "-" + day);		
		
	//---------------------------------------------------------------------	
		
	// Set file name
	filename = 'sap_exchrate_' + year + month + day + ".txt";
	ctrlName = filename + '.ctrl';
	dirPath = '/Nodejs/exchange_rate/text_file';
	fullPath = dirPath + '/' + filename;
	ctrlPath = dirPath + '/' + ctrlName;
	strNull = ' ';	
	
	fs.readFile(fileCurr, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		arrCurr = JSON.parse(data);
		const arrList = arrCurr.currency;
		//console.log(arrList);
		for (i = 0; i < arrList.length; i++) {
			// arrListCurr.push(arrList[i]);
			writeCurrencyDetail(arrList[i]);
		}
		console.log('Success!');

	});
}

//----------------------------------------------------------------------------------------

function writeCurrencyDetail(currency) {
	data = {
		'start_period': year + "-" + month + "-" + day,//'2002-01-12',
		'end_period': year + "-" + month + "-" + day,//'2002-01-15'
		'currency': currency
	}
	options = {
		// proxy: 'http://127.0.0.1', //proxy
		url: 'https://iapi.bot.or.th/Stat/Stat-ExchangeRate/DAILY_AVG_EXG_RATE_V1/?' + querystring.stringify(data),

		headers: {
			'api-key': 'U9G1L457H6DCugT7VmBaEacbHV9RX0PySO05cYaGsm'
		}
	};

	// Send API
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var strJson = JSON.parse(body);
			if(strJson.result.data.data_detail[0].buying_transfer != "" &&       
			   strJson.result.data.data_detail[0].selling != "" &&
			   strJson.result.data.data_detail[0].mid_rate != ""){
				   
				strFinal = strJson.result.timestamp + "|" +
				strJson.result.data.data_header.last_updated + "|" +
				strJson.result.data.data_detail[0].period + "|" +
				strJson.result.data.data_detail[0].currency_id + "|" +
				strJson.result.data.data_detail[0].currency_name_th + "|" +
				strJson.result.data.data_detail[0].currency_name_eng + "|" +
				strJson.result.data.data_detail[0].buying_sight + "|" +
				strJson.result.data.data_detail[0].buying_transfer + "|" +
				strJson.result.data.data_detail[0].selling + "|" +
				strJson.result.data.data_detail[0].mid_rate + "\r\n";

				if (!fs.existsSync(dirPath)) { 
					fs.mkdirSync(dirPath); 
					console.log('create');
				}
			
				//concatenateString(strJson,strFinal);
				fs.appendFile(fullPath, strFinal, function (err) {  // writeFile = overwrite
				if (err) throw err;
				
				else
					fs.chmod(fullPath, '0777');		
				});
				
				fs.writeFile(ctrlPath, strNull, function (err) { 
				if (err) throw err;	
				
				else
					fs.chmod(ctrlPath, '0777');
				});
			}
			else{
				console.log('No Currency Exchange Rates');
			}
		}
		else {
			console.log('Cannot connect.');
		}
	})
	//----------------------------------------------------------------------------------------
}


