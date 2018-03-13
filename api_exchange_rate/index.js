var cron = require('node-cron');
//cron.schedule('0 0 20 * * *', function(){  // Run everyday at 8.00 pm.
cron.schedule('0 3 15 * * *', function(){
//cron.schedule('0 30 0 * * *', function(){	 // Run everyday at 0.30 am.
  var currencyJob = require('./main');
  var d = new Date();
  var n = d.toLocaleString();
  console.log('Job run : ' + n);
  currencyJob();
});