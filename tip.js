function init(){
  var canvas = document.getElementById('demoCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('dblclick', doubleClick, false);

  var mouse = {x: 0, y:0};

  var polygons = [];
  var points = [];
  var lines = [];

  var stage = new createjs.Stage(canvas);

  var vertexAmount = parseInt(prompt("Insert amount of vertex:", 3));

  while(vertexAmount > 51 || vertexAmount < 3 || vertexAmount == null || isNaN(vertexAmount)){

    vertexAmount = parseInt(prompt("Invalid amount of vertex, please insert again\n(Must be between 3 and 12)", 3));

  }

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

    if(event.target instanceof createjs.Shape){
      console.log("Denes");
    }
    else {
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

    for(i = 0; i < vertexAmount; i++){
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

    line.graphics.setStrokeStyle(1).beginStroke("#828282");
    line.graphics.moveTo(bx, by);
    line.graphics.lineTo(ex, ey);
    line.graphics.endStroke();
    stage.addChild(line);
    console.log("Dayum, one more line");
    return line;
  }

  function deCasteljau(){
    for(i=0; i < polygons.length; i++){
      for(j=0; j < vertexAmount; j++){

      }
    }
  }

  var startButton = document.getElementById("start");

  startButton.onclick = function(){
    // FUNCAO DE INICIAR BEZIER
  }

  var clearButton = document.getElementById("clear");

  clearButton.onclick = function(){
    for(i = 0; i < points.length; i++){
      console.log(stage.removeChild(lines[i]));
      stage.removeChild(points[i]);
    }
    for(i = 0; i < polygons.length; i++){stage.removeChild(polygons[i]);}

    polygons = [];
    lines = [];
    points = [];

    createPolygon(canvas.width/4, canvas.height/2);

    stage.clear();
    stage.update();
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
