function init(){
  var canvas = document.getElementById('demoCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('dblclick', doubleClick, false);

  var mouse = {x: 0, y:0};

  var polygons = [];

  var stage = new createjs.Stage(canvas);

  var vertexAmount = parseInt(prompt("Insert amount of vertex:", 3));

  while(vertexAmount > 12 || vertexAmount < 3 || vertexAmount == null || isNaN(vertexAmount)){

    vertexAmount = parseInt(prompt("Invalid amount of vertex, please insert again\n(Must be between 3 and 12)", 3));

  }

  // Get polygons

  // start

  var shape = new createjs.Shape();

  var circle = createPoint(canvas.width/2, canvas.height/2);

  stage.update();

  function pressMove(event){
    event.target.x = event.stageX;
    event.target.y = event.stageY;

    stage.clear();
    stage.update();
  }

   function doubleClick(event){
    mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
    mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

    createPolygon(mouse.x, mouse.y);
    return;
  }

  function createPolygon(x, y){
    var poly = new Polygon();
    poly.center = {x: x, y: y};

    poly.points.push(createPoint(poly.center.x + 150 * Math.cos(0), poly.center.y + 150 * Math.sin(0)));

    for(var i = 1; i < vertexAmount; i++){
      poly.points.push(createPoint(poly.center.x + 150 * Math.cos(i * 2 * Math.PI / vertexAmount), poly.center.y + 150 * Math.sin(i * 2 * Math.PI / vertexAmount)));
    }

    for(i = 0; i < vertexAmount; i++){
      if(i+1 < vertexAmount){
        poly.lines.push(createLine(poly.points[i].x, poly.points[i].y, poly.points[i+1].x, poly.points[i+1].y));
      }
      else{
        poly.lines.push(createLine(poly.points[i].x, poly.points[i].y, poly.points[0].x, poly.points[0].y));
      }
    }

    polygons.push(poly);

    stage.update();
  }

  function createPoint(centerX, centerY){
    var point = new createjs.Shape();
    point.on("pressmove", pressMove);
    point.graphics.beginFill("#f2f2f2").drawCircle(0, 0, 7);
    point.x = centerX;
    point.y = centerY;
    stage.addChild(point);
    return point;
  }

  function createLine(bx, by, ex, ey){
    var shape = new createjs.Shape();

    shape.graphics.setStrokeStyle(1).beginStroke("#F2F2F2");
    shape.graphics.moveTo(bx, by);
    shape.graphics.lineTo(ex, ey);
    shape.graphics.endStroke();
    stage.addChild(shape);
  }

  function updateLine(bx, by, ex, ey){

  }

}

function Polygon(){
  this.center;
  this.points = [];
  this.lines = [];
}

function Point(x, y){
  this.x = x;
  this.y = y;
}
