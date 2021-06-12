// ************************************ БАЗОВАЯ ФУНКЦИЯ ****************************************
CanvasRenderingContext2D.prototype.dashedLine = function (x, y, x2, y2, dashArray, start) {
    let dashCount = dashArray.length;
    let dashSize = 0;

    for (i = 0; i < dashCount; i++) {
        dashSize += parseInt(dashArray[i]);
    }

    let dx = (x2 - x)
    let dy = (y2 - y);
    let slopex = (dy < dx);
    let slope = (slopex) ? dy / dx : dx / dy;
    let dashOffSet = dashSize * (1 - (start / 100))
    if (slopex) {
        let xOffsetStep = Math.sqrt(dashOffSet * dashOffSet / (1 + slope * slope));
        x -= xOffsetStep;
        dx += xOffsetStep;
        y -= slope * xOffsetStep;
        dy += slope * xOffsetStep;
    } else {
        let yOffsetStep = Math.sqrt(dashOffSet * dashOffSet / (1 + slope * slope));
        y -= yOffsetStep;
        dy += yOffsetStep;
        x -= slope * yOffsetStep;
        dx += slope * yOffsetStep;
    }
    this.moveTo(x, y);
    let distRemaining = Math.sqrt(dx * dx + dy * dy);
    let dashIndex = 0
    let draw = true;
    while (distRemaining >= 0.1 && dashIndex < 10000) {
        dashIndex++
        let dashLength = 10
        if (dashLength > distRemaining) dashLength = distRemaining;
        if (slopex) {
            let xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            x += xStep
            y += slope * xStep;
        } else {
            let yStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            y += yStep
            x += slope * yStep;
        }
        if (dashOffSet > 0) {
            dashOffSet -= dashLength;
            this.moveTo(x, y);
        } else {
            this[draw ? 'lineTo' : 'moveTo'](x, y);
        }
        distRemaining -= dashLength;
        draw = !draw;
    }
    this.moveTo(100, 0);
}
// ************************************ ИНИЦИАЛИЗАЦИЯ ****************************************

const body = document.getElementsByTagName('body')[0]
body.addEventListener('click', switchLamp);
let canvas = document.getElementsByTagName('canvas')[0];

// Свойства canvas'a
canvas.width = 1500;
canvas.height = 700;
let context = canvas.getContext('2d');
context.lineWidth = 2
context.font = '20px arial'
context.strokeStyle = 'red' //цвет линий
context.fillStyle = 'yellow' //цвет заливки

const paddingTopBottom = 130 //отступы сверху и снизу
const paddingLeftRight = 350 //отступы слева и справа

let isSwitchOn = false //состояние выключателя
let currentOffset = 0
let currentOffset2 = 0
const dashGapArray = [10, 10] //[длина тире, отступ между тире]
const redrawInterval = 25 // интервал перерисовки(ms)

// ************************************ ОСНОВНАЯ ЧАСТЬ ****************************************

window.setInterval(draw, redrawInterval);

// ************************************ ФУНКЦИИ ****************************************

function draw() {

    // Очистка результата предыдушего рендера
    clear()

    // Отрисовка элементов электрической цепи
    drawPowerSource()

    drawSwitchKey()

    drawLamp()

    // Отрисовка проводников
    drawTopAndRightLines()

    drawLeftAndBottomLines()

    updateOffsets(isSwitchOn)

}

function drawPowerSource() {
    // Надпись источника питания
    context.strokeText('Источник', paddingLeftRight - 130, canvas.height / 2 - 30)
    context.strokeText('питания', paddingLeftRight - 130, canvas.height / 2 - 10)

    // Знаки полярности источника питания
    context.strokeText('+', paddingLeftRight + 25, canvas.height / 2 - 25)
    context.strokeText('-', paddingLeftRight + 27, canvas.height / 2 - 5)

    // Источник питания (большая черта)
    context.beginPath()
    context.moveTo(paddingLeftRight - 15, canvas.height / 2 - 25)
    context.lineTo(paddingLeftRight + 15, canvas.height / 2 - 25)

    // Источник питания (маленькая черта)
    context.moveTo(paddingLeftRight - 10, canvas.height / 2 - 15)
    context.lineTo(paddingLeftRight + 10, canvas.height / 2 - 15)
    context.stroke()
}


function drawSwitchKey() {

    context.strokeText('Выключатель', canvas.width / 2 - 55, paddingTopBottom - 40)
    context.beginPath();

    if (isSwitchOn) {
        // Включенное состояние выключателя
        context.moveTo(canvas.width / 2 - 20, paddingTopBottom)
        context.lineTo(canvas.width / 2 + 18, paddingTopBottom)
    } else {
        // Отключенное состояние выключателя
        context.moveTo(canvas.width / 2 - 25, paddingTopBottom)
        context.lineTo(canvas.width / 2 + 10, paddingTopBottom - 30)
    }

    // Координаты левого контакта выключателя
    const leftContactPos = {
        x: canvas.width / 2 - 25,
        y: paddingTopBottom
    }

    // Координаты правого контакта выключателя
    const rightContactPos = {
        x: canvas.width / 2 + 25,
        y: paddingTopBottom
    }

    // Контакт выключателя(слева)
    context.moveTo(leftContactPos.x + 5, leftContactPos.y);
    context.arc(leftContactPos.x, leftContactPos.y, 5, 0, 2 * Math.PI);

    // Контакт выключателя(справа)
    context.moveTo(rightContactPos.x + 5, rightContactPos.y);
    context.arc(rightContactPos.x, rightContactPos.y, 5, 0, 2 * Math.PI);

    context.stroke()
    context.fill() //заливка круга цветом 

}

// Переключение лампочки
function switchLamp() {
    isSwitchOn = isSwitchOn ? false : true
}


function drawLamp() {
    // Надпись лампочки
    context.strokeText('Лампочка', canvas.width - 300, canvas.height / 2 - 5)

    // Лампочка
    const radius = 30
    context.beginPath()
    context.moveTo(canvas.width - paddingLeftRight + radius, canvas.height / 2 - 10);
    context.arc(canvas.width - paddingLeftRight, canvas.height / 2 - 10, radius, 0, 2 * Math.PI);
    context.stroke();
    // Лампочка end

    //если выключатель включен, заливаем круг(лампочку) желтым цветом
    if (isSwitchOn) context.fill()
}


//Функция для отрисовки верхнюю и правую линии
function drawTopAndRightLines() {

    context.beginPath(); //Новая линия
    // Верхняя горизонтальная линия(слева от выключателя)*****
    context.dashedLine(paddingLeftRight, paddingTopBottom, canvas.width / 2 - 30, paddingTopBottom, dashGapArray, currentOffset);

    //Верхняя горизонтальная линия(справа от выключателя) *****
    context.dashedLine(canvas.width / 2 + 30, paddingTopBottom, canvas.width - paddingLeftRight, paddingTopBottom, dashGapArray, currentOffset);

    // Правая вертикальная линия (до лампочки) *****
    context.dashedLine(canvas.width - paddingLeftRight, paddingTopBottom, canvas.width - paddingLeftRight, canvas.height / 2 - 40, dashGapArray, currentOffset)

    // Правая вертикальная линия (после лампочки) *****
    context.dashedLine(canvas.width - paddingLeftRight, canvas.height / 2 + 20, canvas.width - paddingLeftRight, canvas.height - paddingTopBottom, dashGapArray, currentOffset)
    context.stroke(); //Завершить линию

};


// Функция для отрисовки нижнюю и левую линии
function drawLeftAndBottomLines() {

    context.beginPath();

    // Правая вертикальная линия до источника питания
    context.dashedLine(paddingLeftRight, paddingTopBottom, paddingLeftRight, canvas.height / 2 - 32, dashGapArray, currentOffset2);

    // Правая вертикальная линия после источника питания
    context.dashedLine(paddingLeftRight, canvas.height / 2 - 10, paddingLeftRight, canvas.height - paddingTopBottom, dashGapArray, currentOffset2);

    // Нижняя линия
    context.dashedLine(paddingLeftRight, canvas.height - paddingTopBottom, canvas.width - paddingLeftRight, canvas.height - paddingTopBottom, dashGapArray, currentOffset2);

    context.stroke();
};

// Обновление отступов
function updateOffsets(isSwitchOn) {
    if (isSwitchOn) {
        currentOffset += 10;
        currentOffset2 -= 10;
    }

    if (currentOffset >= 100) currentOffset = 0;
    if (currentOffset2 <= - 100) currentOffset2 = 0;
}

// Очистка результата предыдущего рендера
function clear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// ****************************************************************************************