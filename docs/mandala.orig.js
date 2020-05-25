/* eslint-disable */
/**
 * @fileoverview Desenhar Mandalas
 * @see https://jsart.co/150/drawing-mandala-with-js-canvas/
 * @see view-source:https://jsart.co/content/experiments/004.html
 *
 * TODO: - Adicionar indicador de cursor
 * TODO: - Separar background em outra camada
 * TODO: - Adicionar opções de brush (formato e cor) e suavização de movimento
 * TODO: - Adicionar funcionalidade de salvar imagem e vídeo
 * TODO: - Adicionar funcionalidade de alterar o número de graus
 * TODO: - Criar funcionalidade de movimento aleatório
 * TODO: - Separar desenho do fundo (possivelmente em camadas)
 *
 */

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousemove', function (e) { findxy('move', e) }, false);
canvas.addEventListener('mousedown', function (e) { findxy('down', e) }, false);
canvas.addEventListener('mouseup', function (e) { findxy('up', e) }, false);
canvas.addEventListener('mouseout', function (e) { findxy('out', e) }, false);

var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;

var flag = false;
var dot_flag = false;

var width = 700; // TODO: get object's width
var height = 700; // TODO: get object's height

var center = {x: width / 2 , y: height / 2};
var radius = (width / 2) - 10;

// Initial draw color
var drawColor = '#acacff'; // '#acacff'

//
var drawLineWidth = 2;
//var drawLineHeight = 5;
var lineColorTransparent = 'rgba(120, 120, 120, 0.3)'

// Number of slices
var slices = 11; // Original: 24


var _angle = 360 / slices;
var _start = 0;

/**
* @param {number} deg
* @param {Point} center
* @param {number} radius
*/
var getPointOnCircle = function (deg, center, radius) {
  var rad = degreesToRadians(deg);
  var x = center.x + radius * Math.cos(rad);
  var y = center.y + radius * Math.sin(rad);
  return { x: x, y: y};
}

/**
* @param {Point} start
* @param {Point} end
* @param {number} width
* @param {string} color
*/
var drawLineStroke = function(start, end, width, color) {
  ctx.lineWidth = width;
  //ctx.lineHeight = width;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

/**
* @param {number} deg
*/
var degreesToRadians = function (deg) {
  return deg * Math.PI/180;
}

/**
* @param {HTMLElement} obj
*/
var color = function (obj) {
  drawColor = obj.id;
};

/**
 * @param {Point} point1
 * @param {Point} point2
 * @param {number} angle
 */
function rotate(point1, point2, angle) {
  angle = degreesToRadians(angle);
  var xr = (point1.x - point2.x) * Math.cos(angle) - (point1.y - point2.y) * Math.sin(angle) + point2.x;
  var yr = (point1.x - point2.x) * Math.sin(angle) + (point1.y - point2.y) * Math.cos(angle) + point2.y;
  return {x:xr, y:yr};
}

/**
 * Draw kaleidoscopically a path
 */
function draw() {
  console.log('draw')
  //draw main line
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = drawColor;
  ctx.lineWidth = drawLineWidth;
  //ctx.lineHeight = drawLineHeight;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.closePath();

  _start = 0;

  //draw copies
  for(var i = 0; i < slices - 1; i++) {
    _start += _angle;
    var rP = rotate({x: prevX, y: prevY}, center, _start);
    var rC = rotate({x: currX, y: currY}, center, _start);
    drawLineStroke(rP, rC, drawLineWidth, drawColor);
  }
}

/**
 * Draw dot
 */
var drawDot = function () {
  console.log('drawDot');
  ctx.beginPath();
  ctx.fillStyle = drawColor;
  ctx.fillRect(currX, currY, drawLineWidth, drawLineWidth);
  ctx.closePath();

  _start = 0;
  for(var i = 0; i < slices - 1; i++) {
    _start += _angle;
    var rotated = rotate({x: currX, y: currY}, center, _start);
    ctx.beginPath();
    ctx.fillStyle = drawColor;
    ctx.fillRect(rotated.x, rotated.y, drawLineWidth, drawLineWidth);
    ctx.closePath();
  }
}

/**
 *
 * @param {*} res
 * @param {*} e
 */
function findxy(res, e) {
  //console.log(res, {currX, currY});
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      drawDot();
      dot_flag = false;
    }
  }
  if (res == 'up' || res == 'out') {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
    }
  }
}


/**
 * start everything, empty circle
 */
var init = function () {

  ctx.clearRect(0,0, width, height);
  ctx.fillStyle = '#212121';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = lineColorTransparent;
  ctx.beginPath();
  // Draw
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
  _start = 0;

  for(var i = 0; i < slices; i++ ) {
    drawLineStroke(center, getPointOnCircle(_start, center, radius), 1, lineColorTransparent);
    _start += _angle;
  }
}

// Run initialization
init();
