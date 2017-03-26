var app = angular.module('NodeshipsApp', []);

app.controller('gameController', function($scope) {
  $scope.title = "Nodeships Angular";

  var renderer = PIXI.autoDetectRenderer(650,520, {antialias: true});
  $('#dashboard').append(renderer.view);
  renderer.backgroundColor = 0x0099ff;

  var stage = new PIXI.Container();

  $scope.coords = [
    'A1','A2','A3','A4','A5',
    'B1','B2','B3','B4','B5',
    'C1','C2','C3','C4','C5',
    'D1','D2','D3','D4','D5',
    'E1','E2','E3','E4','E5'
  ];

  var ship = createShip()
  var grid = drawGrid();
  stage.addChild(grid);
  stage.addChild(ship);
  $scope.selectedCell = '';
  animate();


  function animate() {
    renderer.render(stage);
    requestAnimationFrame(animate);
  }

  function drawGrid() {
    var width = 100;
    var height = 100;
    var cols = 5;
    var rows = 5;
    var grid = new PIXI.Container();
    for(var y = 0; y < rows; y++) {
      for(var x =0; x < cols; x++) {
        grid.addChild(drawCell(x*width,y*height,width,height,x+y*cols));
      }
    }
    grid.x = 10;
    grid.y = 10;
    return grid;
  }

  function drawCell(x,y,width,height,id) {
    var cell = new PIXI.Graphics();
    cell.beginFill(0x0099FF);
    cell.alpha = 0.5;
    cell.lineStyle(1,0x000000,1);
    cell.drawRect(0,0,width,height);
    cell.endFill();
    cell.x = x;
    cell.y = y
    cell.id = id;
    cell.interactive = true;
    cell.buttonMode = true;
    return cell;
  }

  function createShip() {
    var ship = new PIXI.Graphics();
    ship.beginFill(0xFFFFFF);
    ship.drawCircle(0,0,25);
    ship.endFill();
    ship.x = 580;
    ship.y = 60;
    ship.interactive = true;
    ship.buttonMode = true;
    ship.on('pointerdown', onDragStart)
        .on('pointermove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd);
    return ship;
  }

  function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
    this.alpha = 0.5;
  }
  function onDragMove() {
    if(this.dragging) {
      var newPosition = this.data.getLocalPosition(this.parent);
      if(newPosition.x < this.width/2 || newPosition.y < this.height/2 ||
         newPosition.x > (renderer.width - this.width/2) ||
         newPosition.y > (renderer.height) - this.height/2) {
        return onDragEnd();
      }
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
  function onDragEnd() {
    this.dragging = false;
    this.alpha = 1;
    this.data = {};
    var secondCell = grid.children[1];
    var targetCell = grid.children.find(cell => {
      var cellPosition = grid.toGlobal(cell.position);
      cellPosition.width = cellPosition.x + cell.width;
      cellPosition.height = cellPosition.y + cell.height;
      return (cellPosition.x < this.x && cellPosition.width > this.x
              && cellPosition.y < this.y && cellPosition.height > this.y)
    });
    if (targetCell) {
      cellPosition = grid.toGlobal(targetCell.position)
      this.x = cellPosition.x + targetCell.width/2;
      this.y = cellPosition.y + targetCell.height/2;
    }
    $scope.selectedCell = targetCell ? $scope.coords[targetCell.id] : '';
    $scope.$apply();
  }
});
