const { DateTime } = require('luxon');

module.exports = function htmlDateString(dateObj) {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
};
