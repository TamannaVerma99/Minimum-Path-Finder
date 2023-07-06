var cols=20;
var rows=20;
var grid=new Array(cols);
var openSet=[];
var closedSet=[];
var start;
var end;
var w,h;
var path=[];
function removeFromArray(arr,elt){
 for(var i=arr.length-1;i>=0;i--){
    if(arr[i]==elt){
        arr.splice(i,1);
    }
 }   
}
function Spot(i,j){
    this.i=i;
    this.j=j;
    this.f=0;
    this.g=0;
    this.h=0;
    this.wall=false;
    if(random(1)<0.3){
      this.wall=true;  
    }
    this.show=function(col){
        fill(col);
        if(this.wall){
            fill(0);
        }
        //noFill();
        //stroke(0);
        //strokeWeight(1);
        noStroke();
        rect(this.i*w,this.j*h,w-1,h-1);
    }
    this.neighbours=[];
    var i=this.i;
    var j=this.j;
    this.addNeighbours=function(grid){
        if(i<cols-1){
        this.neighbours.push(grid[i+1][j]);
        }
        if(i-1>=0){
        this.neighbours.push(grid[i-1][j]);
        }
        if(j+1<rows){
        this.neighbours.push(grid[i][j+1]);
        }
        if(j>=1){
        this.neighbours.push(grid[i][j-1]);
        }
        if(j>0 && i>0){
            this.neighbours.push(grid[i-1][j-1]);
            }
        if(i<cols-1 && j<rows-1){
            this.neighbours.push(grid[i+1][j+1]);
        }
        if(i<cols-1 && j>0){
            this.neighbours.push(grid[i+1][j-1]);
        }
        if(i>0 && j<rows-1){
            this.neighbours.push(grid[i-1][j+1]);
        }
    }
    this.previous=undefined;
   
}
function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    // var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
  }
function setup() {
    createCanvas(500, 500); // Creates a canvas with width 400 and height 400
    //console.log('A*');
    w=width/cols;
    h=height/rows;
    for(var i=0;i<cols;i++){
        grid[i] = new Array(rows);   
    for(var j=0;j<rows;j++){
    grid[i][j]=new Spot(i,j);
    //grid[i][j].addNeighbours(grid);
    }   
    }
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j].addNeighbours(grid);
        }
      }
      start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
  //canvas.mousePressed(mousePressedOnCanvas);

  //setStartNode();
  //draw();
  }
  function mousePressedOnCanvas() {
    const i = Math.floor(mouseX / w);
    const j = Math.floor(mouseY / h);
  
    if (!start) {
      start = grid[i][j];
      start.wall = false;
      openSet.push(start);
    } else if (!end) {
      end = grid[i][j];
      end.wall = false;
      openSet.push(end);
    } else {
      grid[i][j].wall = !grid[i][j].wall;
    }
  }
  /*function setStartNode(){
    var sr = parseInt(document.getElementById('start-input-row').value);
    var sc = parseInt(document.getElementById('start-input-column').value);
    var er = parseInt(document.getElementById('end-input-row').value);
    var ec = parseInt(document.getElementById('end-input-column').value);
  
    start = grid[sr][sc];
    end = grid[er][ec];
    start.wall = false;
    end.wall = false;
    openSet.push(start);
  
    loop();
  }*/
  function draw(){
    if(openSet.length>0){
       var winner=0;
       for(var i=0;i<openSet.length;i++){
        if(openSet[i].f<openSet[winner].f){
            winner=i;
        }
       }
       var current=openSet[winner];
       if(current===end){
        noLoop();
        path=[];
        var temp=current;
        path.push(temp);
        while(temp.previous){
            path.push(temp.previous);
            temp=temp.previous;
        }
        console.log("DONE!");
       }
       removeFromArray(openSet,current);
       closedSet.push(current);
       var neighbours=current.neighbours;
       for(var i=0;i<neighbours.length;i++){
        var neighbour=neighbours[i];
         
        if(!closedSet.includes(neighbour) && !neighbour.wall ){
        var tempG=current.g+1;
        var newPath=false;
        if(openSet.includes(neighbour)){
            if(tempG<neighbour.g){
                neighbour.g=tempG;
                newPath=true;
            }
        }
        else{
            neighbour.g=tempG;
            newPath=true;
            openSet.push(neighbour);
        }
        if(newPath){
        neighbour.h=heuristic(neighbour,end);
        neighbour.f=neighbour.g+neighbour.h;
        neighbour.previous=current;
        }
    }

        
       }
    }
    else{
    console.log('solution');
    }
    background(0);
    for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
     grid[i][j].show(color(255));   
    }
    }
    for(var i=0;i<closedSet.length;i++){
      closedSet[i].show(color(255,182,193));
    }
    for(var i=0;i<openSet.length;i++){
        openSet[i].show(color(0,255,0));
      }
      for(var i=0;i<path.length;i++){
        path[i].show(color(0,0,255));
      }
  }
  /*function startover() {
    path = new Array()
    
    start.previous = undefined
    end.previous = undefined
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j].addNeighbours(grid);
        }
      }
      var sr = parseInt(document.getElementById('start-input-row').value);
    var sc = parseInt(document.getElementById('start-input-column').value);
    var er = parseInt(document.getElementById('end-input-row').value);
    var ec = parseInt(document.getElementById('end-input-column').value);
  
    start = grid[sr][sc];
    end = grid[er][ec];
   start.wall = false
    end.wall = false 
    openSet = new Array()
    closedSet = new Array()
    openSet.push(start)
}
document.querySelector('.start').onclick = () => {
    
        startover()
        
    }*/