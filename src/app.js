// alert('oi');
const util = require('util');

window.addEventListener('DOMContentLoaded', (e) => {
  console.log('dcl : ' + util.format('%j', e.target));
});
