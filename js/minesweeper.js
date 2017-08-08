
var time = 0;
var game = {"rows":10,"columns":10,"mines":10,"win":true};
var target={'x':0,'y':0};
var board=[];
function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    var columns = game.columns;
    var rows = game.rows;
    var board=[];
    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        board[y]=[];
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
            //container of objects hander logic 
            board[y][x]={"element":tile,"isMine":false,"count":0,"reveal":false};
        }
    }
    // for (var i = 0, len = grid.children.length; i < len; i++)
    // {

    // (function(index){
    //     grid.children[i].onclick = function(){
    //           if(index<game.columns){
    //             target.x = index;
    //             target.y = 0;
    //           }else{
    //              var y = 0;
    //              var x = index;   
    //              while(x>game.columns){
    //                  x -= game.columns;
    //                  y++;   
    //              }
    //              target.x = x;
    //              target.y = y;
    //           }
    //     }    
    // })(i);

    // }
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
    console.log(board);
    //build the mine randomly
    buildMine(board);
    return board;
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks
    return tile;
}

function startGame() {
    setDifficulty();
    board = buildGrid();
    console.log(board);
    startTimer();
    smileyUp();
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
    smiley.classList.remove("face_lose");
    smiley.classList.remove("face_win");
}
function gameOver(){
    var smiley = document.getElementById("smiley");
    if(!game.win){
        smileyUp();
        smiley.classList.add("face_lose");
        alert('Oops, you hit a mine, game over');
        revealAll();
    }
    else{
        smileyUp();
        smiley.classList.add("face_win");
        game.win=false;
        alert('awesome!');
        revealAll();
    }

}
function getIndex(element){
    var grid = document.getElementById("minefield");
    var nodes = Array.prototype.slice.call(grid.children);
    var index = nodes.indexOf(element);
    var x,y;
    console.log("index:" +index);
    if(index<=game.columns-1){
        x = index;
        y = 0;
    }
    else{
        y = 0;
        x = index;   
        while(x>game.columns-1){
             x= x - game.columns;
             y++;   
        }
    }
    return [y,x];    
}
function handleTileClick(event) {
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
        console.log(getIndex(this));
        if(!this.classList.contains("flag")){
            var index = getIndex(this);
            var row = index[0],col=index[1];
            var filed = board[row][col];
            console.log(board[row][col]);
            if(filed.isMine){
                this.classList.add('mine_hit');
                game.win=false;
                gameOver();
            }
            else{
                if(filed.count>0){
                    filed.element.classList.remove("hidden");
                    filed.element.classList.add("tile_"+filed.count);
                    filed.reveal=true;
                    check();
                }
                else{
                    showMore(row,col);
                }
            }
        }
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
        if(this.classList.contains("flag"))
            this.classList.remove("flag");
        else 
            this.classList.add("flag");

    }
}
function showMore(row,col){
    var c,r;
    var row = row;
    var col = col;
     if((row-1>=0)&&(col-1>=0)){
        c = col-1;
        r = row-1;
        reveal(row,col,r,c);
    }
     if(row>=1){
        c = col;
        r = row-1;
        reveal(row,col,r,c);
    }
     //top right
       if((row-1>=0)&&(col<=game.columns-2)){
        c = col+1;
        r = row-1;
        reveal(row,col,r,c);
    }
     //left
        if(col>=1){
            r = row;
            c = col-1;
        reveal(row,col,r,c);
    }
     //right
      if(col<=col-2){
        r = row;
        c = col+1;
        reveal(row,col,r,c);
    }
     //bot left
       if((row<=game.rows-2)&&(col-1>=0)){
            c = col-1;
            r = row+1;
          reveal(row,col,r,c);
    }
       //bot
      if(row<=game.rows-2){
            c = col;
            r = row+1;
       reveal(row,col,r,c);
    }
       //right bot
       if((row<=game.rows-2)&&(col<=game.columns-2)){
            c = row+1;
            r = col+1;
        reveal(row,col,r,c);
    }
}
function reveal(row,col,r,c){
     board[row][col].element.classList.remove("hidden");
        board[row][col].element.classList.add("tile_"+board[row][col].count);
        board[row][col].reveal=true;
        check();
        if(board[r][c].count!=0&&(!board[r][c].isMine)){
            board[r][c].element.classList.remove("hidden");
            board[r][c].element.classList.add("tile_"+board[r][c].count);
            board[r][c].reveal=true;
        }
        else{
             if(!board[r][c].isMine&&!board[r][c].reveal)
             showMore(r,c);
         }
    
}
function revealAll(){
    for(var i=0;i<game.rows;i++){
        for(var j=0;j<game.columns;j++){
            if(board[i][j].element.classList.contains("hidden")){
                if(board[i][j].isMine){
                    board[i][j].element.classList.remove("hidden");
                    board[i][j].element.classList.add("mine");
                }
                else{
                    board[i][j].element.classList.remove("hidden");
                    board[i][j].element.classList.add("tile_"+board[i][j].count);
                }
            }
        } 
    }
}

function check(){
    var count = document.getElementsByClassName('hidden').length;
    console.log(count);
    if(count == game.mines)
    gameOver();     
}
//By Chenhai
function buildMine(board){
    var placed=0,x,y;
    while(placed<game.mines){
        x = Math.floor((Math.random() * (game.columns-1)) + 0);
        y = Math.floor((Math.random() * (game.rows-1)) + 0);
        if(!board[y][x].isMine){
            board[y][x].isMine=true;
            placed++;
            //board[x][y].classList.add("mine");
        }
    } 
    countMines(board);
}
function countMines(board){
    var i,j;
    for(var i=0;i<game.rows;i++){  
        for(var j=0;j<game.columns;j++){  
            var mineNum=0;   
            if((i-1>=0)&&(j-1>=0)){  
                if(board[i-1][j-1].isMine)  
                mineNum++;  
            }  
            if(i>=1){  
                if(board[i-1][j].isMine)  
                mineNum++;  
            }  
            if((i-1>=0)&&(j<=game.columns-2)){  
                if(board[i-1][j+1].isMine)  
                mineNum++;  
            }  
            if(j>=1){  
                if(board[i][j-1].isMine)  
                mineNum++;  
            }  
            if(j<=game.columns-2){  
                if(board[i][j+1].isMine)  
                mineNum++;  
            }  
            if((i<=game.rows-2)&&(j-1>=0)){  
                if(board[i+1][j-1].isMine)  
                mineNum++;  
            }  
            if(i<=game.rows-2){  
                if(board[i+1][j].isMine)  
                mineNum++;  
            }  
            if((i<=game.rows-2)&&(j<=game.columns-2)){  
                if(board[i+1][j+1].isMine)  
                mineNum++;  
            }  
            if(!board[i][j].isMine){      
            board[i][j].count = mineNum;  
            // board[i][j].element.classList.remove("hidden");
            // board[i][j].element.classList.add("tile_"+mineNum);
            }  
        }  
    }
}
function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;
    if(difficulty==0)
         game = {"rows":9,"columns":9,"mines":10,"win":true};
    else if(difficulty==1)
         game = {"rows":16,"columns":16,"mines":40,"win":true}; 
    else if(difficulty==2)
         game = {"rows":36,"columns":16,"mines":99,"win":true}; 
    //TODO implement me
}

function startTimer() {
    timeValue = 0;
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    if(game.win){
    timeValue++;
    updateTimer();
    }

}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}
