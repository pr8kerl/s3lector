/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    logger = require('./logevents'),
    LogEvent = mongoose.model('LogEvent');

exports.log = function(luser, lmsg) {
  var logevent = new LogEvent();
  logevent.user = luser.provider + ': ' + luser.name;
  if (luser.email !== null) {
    logevent.user = logevent.user + ' <' + luser.email + '>';
  }
  logevent.msg = lmsg;
  logevent.save(function(err) {
      if (err) {
        console.log('logevent failed : %s', err);
      }   
  }); 
};


