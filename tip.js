function init(){
  var canvas = document.getElementById('demoCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('dblclick', doubleClick, false);

  var mouse = {x: 0, y:0};

  var started = false;
  var hidden = false;
  var hiddenCurves = false;
  var hiddenPolys = false;
  var red = 130, green = 130, blue = 130;

  var polygons = [];
  var points = [];
  var lines = [];
  var evaluatedPolys = [];

  var tempBezierLines = [];

  var stage = new createjs.Stage(canvas);

  var vertexAmount = parseInt(prompt("Insert amount of vertex:", 3));

  while(vertexAmount > 12 || vertexAmount < 3 || vertexAmount == null || isNaN(vertexAmount)){

    vertexAmount = parseInt(prompt("Invalid amount of vertex, please insert again\n(Must be between 3 and 12)", 3));

  }

  createPolygon(canvas.width/4, canvas.height/2);

/*
 *    FUNCAO DE ATUALIZACAO DAS CURVAS
 *    CHAMADA CADA VEZ QUE OCORRE ALGUMA MUDANCA
 *    QUE AFETE AS CURVAS DE BEZIER DOS POLIGONOS
 */
  function updateCurves(){
    for(let line of tempBezierLines){
      stage.removeChild(line);
    }

    tempBezierLines = [];

    var tempBezierCurves = [];

    for(var i = 0; i < vertexAmount; i++){
      var tempi = [];
      for(var j = 0; j < polygons.length; j++){
        tempi.push(polygons[j].points[i]);
      }
      tempi = bezier(tempi, 100);
      tempBezierCurves.push(tempi);
    }

    for(let curve of tempBezierCurves){
      for(var p = 0; p < curve.length-1; p++){
        tempBezierLines.push(createLine(curve[p].x, curve[p].y,
          curve[p+1].x, curve[p+1].y));
      }
    }
    stage.clear();
    stage.update();
  }

  /*
   *   MOVER OS PONTOS DE CONTROLE
   */

  function pressMove(event){
    if(!started){
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
      updateCurves();
    }

    stage.clear();
    stage.update();
  }

  /*
   *   ADICIONAR POLIGONOS
   */

  function doubleClick(event){
    mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
    mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

    if(!started){
      createPolygon(mouse.x, mouse.y);
      updateCurves();
    }
    return;
  }

  /*
   *  CRIAR POLIGONOS
   */

  function createPolygon(x, y){
    if(!started){
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
  }

  /*
   * FUNCAO AUXILIAR PARA CRIAR OS PONTOS DE CONTRLE
   */

  function createPoint(centerX, centerY){
    var point = new createjs.Shape();
    point.on("pressmove", pressMove);
    point.graphics.beginFill("#f2f2f2").drawCircle(0, 0, 8);
    point.x = centerX;
    point.y = centerY;
    stage.addChild(point);
    return point;
  }

  /*
   *  CRIAR LINHAS
   */

  function createLine(bx, by, ex, ey){
    var line = new createjs.Shape();
    var grossura = 1;

    if(started){
      grossura = 3;
    }
    else{
      red = 130, green = 130, blue = 130;
    }

    var max = 255, min = 90;

    if(red == max && green == min && blue < max){
      blue+=3;
    }else if(red > min && green == min && blue == max){
      red-=3;
    }else if(red == min && green < max && blue == max){
      green+=3;
    }else if(red == min && green == max && blue > min){
      blue-=3;
    }else if(red < max && green == max && blue == min){
      red+=3;
    }else if(red == max && green > min && blue == min){
      green-=3;
    }

    line.graphics.setStrokeStyle(grossura).beginStroke("rgba("+red+", "+green+", "+blue+", 1)");
    line.graphics.moveTo(bx, by);
    line.graphics.lineTo(ex, ey);
    line.graphics.endStroke();
    stage.addChild(line);
    return line;
  }

  /*
   *  FUNCAO DE DECASTELJAU:
   *  - RECEBE UM ARRAY DE PONTOS DE CONTROLE DE UMA CURVA E UM VALOR DE t
   *  - RETORNA O PONTO NA CURVA PARA O t DADO
   */

  function deCasteljau(b, t){
    var temp = [];
    for(var i = 0; i < b.length; i++){
      temp.push(b[i]);
    }

    for(var i = 0; temp.length > 1; i++){
      var m = temp.shift();
      var n = temp[0];

      temp.push({x: (m.x*(1-t) + n.x*t).toFixed(4), y: (m.y*(1-t) + n.y*t).toFixed(4)});

      if(i == temp.length-2){
        temp.shift();
        i = -1;
      }
    }
    return temp[0];
  }

  /*
   *  FUNCAO DE BEZIER:
   *  - RECEBE UM ARRAY DE PONTOS DE CONTROLE E UM NUMERO DE AVALIACOES DE DECASTELJAU
   *  - RETORNA UM ARRAY DE PONTOS DA CURVA PARA O NUMERO DE AVALIACOES DADO
   */

  function bezier(b, numDC){
    var res = [];

    for(var i = 0; i <= numDC; i++){
      res.push(deCasteljau(b, (i/numDC)));
    }

    return res;
  }

  /*
   *  BOTAO START:
   *  PROCEDIMENTO DE INICALIZACAO DA ANIMACAO
   */

  var startButton = document.getElementById("start");

  startButton.onclick = function(){

    var numDC = parseInt(prompt("Número de avaliações que a curva deve ter:\n(min: 20)", 100));

    while(numDC > 1500 || numDC < 20 || numDC == null || isNaN(numDC)){
      numDC = parseInt(prompt("ENTRADA INVÁLIDA\nNúmero de avaliações que a curva deve ter:\n(min: 20)", 100)) + 1;
    }

    var bezierCurves = [];
    for(var i = 0; i < vertexAmount; i++){
      var tempi = [];
      for(var j = 0; j < polygons.length; j++){
        tempi.push(polygons[j].points[i]);
      }
      tempi = bezier(tempi, numDC);
      bezierCurves.push(tempi);
    }

    if(!hidden){
      hideButton.click();
    }

    // hideButton.onclick = null;
    // clearButton.onclick = null;
    // doubleClick = null;

    stage.clear();
    stage.update();

    started = true;
    red = 255, green = 90, blue = 90;

    animate(bezierCurves, numDC);

    started = false;
    red = 130, green = 130, blue = 130;

  }

  /*
   *  FUNCAO DE ANIMACAO
   */

  async function animate(curves, numDC){
    var linesBezier = [];

    for(var i = 0; i < numDC; i++){
      for(var j = 0; j < vertexAmount; j++){
        var rel = 0;
        if((j+1) % vertexAmount == 0){
          rel = (j+1)-vertexAmount;
        }
        else{
          rel = j+1;
        }
        linesBezier.push(createLine(curves[j][i].x, curves[j][i].y, curves[rel][i].x, curves[rel][i].y));
        stage.removeChild(linesBezier[linesBezier.length-1]);
      }
    }

    for(var pt = 0; pt < vertexAmount; pt++){
      var rel = 0;
      if(pt == vertexAmount-1){
        rel = 0;
      }else{
        rel = pt+1;
      }
      linesBezier.push(createLine(polygons[polygons.length-1].points[pt].x, polygons[polygons.length-1].points[pt].y, polygons[polygons.length-1].points[rel].x, polygons[polygons.length-1].points[rel].y));
      stage.removeChild(linesBezier[linesBezier.length-1]);
    }

    for(var counter = 0; linesBezier.length > 0; counter += vertexAmount){
      for(var j = 0; j < vertexAmount; j++){
        stage.addChild(linesBezier[j]);
      }
      stage.clear();
      stage.update();

      var timeout = 10;
      if(numDC > 299){timeout = 0;}
      else if (numDC < 100) {timeout = 50;}
      await sleep(timeout);


      /*  PARA MAIS EFEITOS VISUAIS COMENTAR O LOOP SEGUINTE  */
      for(var j = 0; j < vertexAmount; j++){
        stage.removeChild(linesBezier.shift());
      }
    }
    stage.clear();
    stage.update();
    linesBezier = undefined;
  }

  /*
   *  BOTAO CLEAR:
   *  PROCEDIMENTO DE LIMPEZA DA TELA
   */

  var clearButton = document.getElementById("clear");

  clearButton.onclick = function(){
    if(!started){
      stage.removeAllChildren();
      polygons = [];
      lines = [];
      points = [];


      hiddenPolys = false;
      hiddenCurves = false;
      hidden = false;

      // createPolygon(canvas.width/4, canvas.height/2);
      // updateCurves();

      stage.clear();
      stage.update();
    }
  }

  /*
   *  BOTAO HIDE:
   *  PROCEDIMENTO MOSTRAR/ESCONDER PONTOS DE CONTROLE
   */

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
  }

  /*
   *  BOTAO HIDECURVES:
   *  PROCEDIMENTO MOSTRAR/ESCONDER CURVAS DE BEZIER
   */

  var hideCurvesButton = document.getElementById("hidecurves");

  hideCurvesButton.onclick = function hideCurves(){
    for(let line of tempBezierLines){
      if(hiddenCurves){
        stage.addChild(line);
      }else{
        stage.removeChild(line);
      }
    }

    hiddenCurves = !hiddenCurves;
    stage.clear();
    stage.update();
  }

  /*
   *  BOTAO HIDEPOLYS:
   *  PROCEDIMENTO MOSTRAR/ESCONDER POLIGONOS
   */

  var hidePolysButton = document.getElementById("hidepoly");

  hidePolysButton.onclick = function hidePolys(){
    for(let line of lines){
      if(hiddenPolys){
        stage.addChild(line);
      }else{
        stage.removeChild(line);
      }
    }

    hiddenPolys = !hiddenPolys;
    stage.clear();
    stage.update();
  }

}

/*
 *  FUNCAO SLEEP PARA CONTROLAR TEMPO DE EXIBICAO DOS FRAMES
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Polygon(){
  this.center;
  this.points = [];
}

function Point(x, y){
  this.x = x;
  this.y = y;
}
