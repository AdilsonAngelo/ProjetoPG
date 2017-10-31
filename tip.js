function init(){
  var canvas = document.getElementById('demoCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('dblclick', doubleClick, false);

  var mouse = {x: 0, y:0};

  var started = false;
  var hidden = false;
  var red = 130, green = 130, blue = 130;

  var polygons = [];
  var points = [];
  var lines = [];
  var evaluatedPolys = [];

  var stage = new createjs.Stage(canvas);

  var vertexAmount = parseInt(prompt("Insert amount of vertex:", 3));

  while(vertexAmount > 51 || vertexAmount < 3 || vertexAmount == null || isNaN(vertexAmount)){

    vertexAmount = parseInt(prompt("Invalid amount of vertex, please insert again\n(Must be between 3 and 12)", 3));

  }

  // var tenes = ['denes', 'tenes', 'penes', 'menes'];
  // console.log(tenes[tenes.length-1]);

  createPolygon(canvas.width/4, canvas.height/2);

  // Get polygons

  // start

  function pressMove(event){
    event.target.x = event.stageX;
    event.target.y = event.stageY;

    var position = points.indexOf(event.target);
    stage.removeChild(lines[position]);

    var temp = points[position+1];
    if((position+1) % vertexAmount == 0){
      var temp2 = points[(position+1)-vertexAmount];
      lines[position] = createLine(event.stageX, event.stageY, temp2.x, temp2.y);
    }
    else{
      lines[position] = createLine(event.stageX, event.stageY, temp.x, temp.y);
    }

    if(position % vertexAmount == 0){
      var pos = position-1+vertexAmount;
      stage.removeChild(lines[pos]);
      lines[pos] = createLine(points[pos].x, points[pos].y, event.stageX, event.stageY);
    }
    else{
      stage.removeChild(lines[position-1]);
      lines[position-1] = createLine(points[position-1].x, points[position-1].y, event.stageX, event.stageY);
    }

    stage.clear();
    stage.update();
  }

   function doubleClick(event){
    mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
    mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

    if(!started){
      createPolygon(mouse.x, mouse.y);
    }
    return;
  }

  function createPolygon(x, y){
    var poly = new Polygon();
    poly.center = {x: x, y: y};

    var p1 = createPoint(poly.center.x + 100 * Math.cos(0), poly.center.y + 100 * Math.sin(0));

    poly.points.push(p1);
    points.push(p1);

    for(var i = 1; i < vertexAmount; i++){
      var pn = createPoint(poly.center.x + 100 * Math.cos(i * 2 * Math.PI / vertexAmount), poly.center.y + 100 * Math.sin(i * 2 * Math.PI / vertexAmount));

      poly.points.push(pn);
      points.push(pn);
    }

    for(var i = 0; i < vertexAmount; i++){
      if(i+1 < vertexAmount){
        var l1 = createLine(poly.points[i].x, poly.points[i].y, poly.points[i+1].x, poly.points[i+1].y);

        lines.push(l1);
      }
      else{
        var l2 = createLine(poly.points[i].x, poly.points[i].y, poly.points[0].x, poly.points[0].y);

        lines.push(l2);
      }
    }

    polygons.push(poly);

    stage.update();
  }

  function createPoint(centerX, centerY){
    var point = new createjs.Shape();
    point.on("pressmove", pressMove);
    point.graphics.beginFill("#f2f2f2").drawCircle(0, 0, 8);
    point.x = centerX;
    point.y = centerY;
    stage.addChild(point);
    return point;
  }

  function createLine(bx, by, ex, ey){
    var line = new createjs.Shape();
    var grossura = 1;

    if(started){
      grossura = 2;
    }

    var max = 255, min = 80;

    if(red == max && green == min && blue < max){
      blue+=5;
    }else if(red > min && green == min && blue == max){
      red-=5;
    }else if(red == min && green < max && blue == max){
      green+=5;
    }else if(red == min && green == max && blue > min){
      blue-=5;
    }else if(red < max && green == max && blue == min){
      red+=5;
    }else if(red == max && green > min && blue == min){
      green-=5;
    }

    line.graphics.setStrokeStyle(grossura).beginStroke("rgba("+red+", "+green+", "+blue+", 1)");
    line.graphics.moveTo(bx, by);
    line.graphics.lineTo(ex, ey);
    line.graphics.endStroke();
    stage.addChild(line);
    console.log("Dayum, one more line");
    return line;
  }

  function deCasteljau(b, t){
    var temp = [];
    for(var i = 0; i < b.length; i++){
      temp.push(b[i]);
    }

    for(var i = 0; temp.length > 1; i++){
      var m = temp.shift();
      var n = temp[0];
      // console.log('m: '+m.x+', '+m.y+' | n: '+n.x+', '+n.y);

      temp.push({x: (m.x*(1-t) + n.x*t), y: (m.y*(1-t) + n.y*t)});

      if(i == temp.length-2){
        temp.shift();
        i = -1;
      }
    }
    return temp[0];
  }

  function bezier(b, numDC){
    var res = [];

    for(var i = 0; i <= numDC; i++){
      res.push(deCasteljau(b, (i/numDC)));
    }

    return res;
  }

  // function animate(){
  //
  // }

  var startButton = document.getElementById("start");

  startButton.onclick = function(){
    // FUNCAO DE INICIAR BEZIER
    started = true;
    red = 255, green = 80, blue = 80;

    var numDC = parseInt(prompt("Número de avaliações que a curva deve ter:\n(min: 10 - max: 150)", 50));

    while(numDC > 150 || numDC < 10 || numDC == null || isNaN(numDC)){
      numDC = parseInt(prompt("ENTRADA INVÁLIDA\nNúmero de avaliações que a curva deve ter:\n(min: 10 - max: 150)", 50));
    }

    var bezierCurves = [];
    for(var i = 0; i < polygons.length; i++){
      tempi = [];
      for(var j = 0; j < vertexAmount; j++){
        tempi.push(polygons[i].points[j]);
      }
      tempi = bezier(tempi, numDC);
      bezierCurves.push(tempi);
    }

    hidePoints();


    animate(bezierCurves);

  }

  var clearButton = document.getElementById("clear");

  clearButton.onclick = function(){
    for(var i = 0; i < points.length; i++){
      stage.removeChild(lines[i]);
      stage.removeChild(points[i]);
    }
    for(var i = 0; i < polygons.length; i++){stage.removeChild(polygons[i]);}

    polygons = [];
    lines = [];
    points = [];

    createPolygon(canvas.width/4, canvas.height/2);

    stage.clear();
    stage.update();
  }

  var hideButton = document.getElementById("hide");

  hideButton.onclick = function hidePoints(){
    for(let point of points){
      if(hidden){
        stage.addChild(point);
      }else {
        stage.removeChild(point);
      }
    }
    hidden = !hidden;
    stage.clear();
    stage.update();
    console.log(points.length);
  }

  function animate(curves){

  }

}

function Polygon(){
  this.center;
  this.points = [];
}

function Point(x, y){
  this.x = x;
  this.y = y;
}
