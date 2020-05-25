// alert('oi');
import './styles.styl';

const util = require('util');

window.addEventListener('DOMContentLoaded', (e) => {
  console.log('dcl : ' + util.format('%j', e.target));
});
