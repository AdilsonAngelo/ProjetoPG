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


  var circle = createPoint(canvas.width/2, canvas.height/2);
  console.log(circle);
  circle.x = canvas.width/2;
  circle.y = canvas.height/2;
  stage.addChild(circle);

  stage.update();

  function pressMove(event){
    event.target.x = event.stageX;
    event.target.y = event.stageY;
    stage.update();
  }

   function doubleClick(event){
    mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
    mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

    createPolygon(mouse.x, mouse.y);
    console.log(mouse.x + ", " + mouse.y);
    return;
  }

  function createPolygon(x, y){
    var poly = new Polygon();
    poly.center = new Point(x, y);

    var p1 = createPoint(poly.center.x + 150 * Math.cos(0), poly.center.y + 150 * Math.sin(0));
    console.log("p1: "+p1);
    poly.points.push(p1);

    for(i = 1; i < vertexAmount; i++){
      var pn = createPoint(poly.center.x + 150 * Math.cos(i * 2 * Math.PI / vertexAmount), poly.center.y + 150 * Math.sin(i * 2 * Math.PI / vertexAmount));
      poly.points.push(pn);
    }
    polygons.push(poly);
    console.log("poly.points: " + poly.points);

    stage.update();

    // renderPoints();
    // animate();
  }

  function createPoint(centerX, centerY){
    var point = new createjs.Shape();
    point.on("pressmove", pressMove);
    point.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 7);
    point.x = centerX;
    point.y = centerY;
    stage.update();
    console.log("chegou aqui:\n" + centerX + ", " + centerY + "\n" + point);
    return point;
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
