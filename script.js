let canvas = document.getElementsByTagName('canvas')[0];

// Свойства canvas'a
canvas.width = 1500;
canvas.height = 700;
let context = canvas.getContext('2d');
context.lineWidth = 2
context.font = '20px arial'
context.strokeStyle = 'red' //цвет линий
context.fillStyle = 'yellow' //цвет заливки