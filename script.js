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
// ************************************************************************

let canvas = document.getElementsByTagName('canvas')[0];

// Свойства canvas'a
canvas.width = 1500;
canvas.height = 700;
let context = canvas.getContext('2d');
context.lineWidth = 2
context.font = '20px arial'
context.strokeStyle = 'red' //цвет линий
context.fillStyle = 'yellow' //цвет заливки
