const date = require('dateformat');

exports.date = date;
exports.today = function (format) {
  return date(new Date(), format);
};
