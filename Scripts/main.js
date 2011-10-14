window.onload = function() {
    var size = 40;
    canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    stage.enableMouseOver(10);
    var tiles = [];
    var players = [];
    var enems = [];
    
    function Player(x,y,img) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.bit = new Bitmap(img);
        this.bit.scaleX = this.bit.scaleY = size/img.height;
        this.bit.x = this.x*size+(size-(img.width*this.bit.scaleX))/2;
        this.bit.y = this.y*size;
        console.log(this.bit.x,this.bit.y);
        stage.addChild(this.bit);
    }
    
    window.tick = function() {
        stage.update();
    };
    function enemLoaded(e) {
        for(var i=0;i<canvas.width/size;i++) {
            var p = new Player(i,0,this);
            players.push(p);
        }
    }
    function imgLoaded(e) {
        console.log(canvas.height,size);
        for(var i=0;i<canvas.width/size;i++) {
            var p = new Player(i,canvas.height/size-1,this);
            players.push(p);
        }
        stage.update();
        Ticker.setFPS(32);
        Ticker.addListener(window);
    }
    function drawTiles() {
        //var size = 40;
        for(var i=0;i<canvas.height/size;i++) {
            for(var j=0;j<canvas.width/size;j++) {
                var g = new Graphics();
                g.beginStroke("#000");
                g.beginFill("rgba(255,255,255,0)");
                g.drawRect(0,0,size,size);
                var s = new Shape(g);
                s.x = j*size;
                s.y = i*size;
                stage.addChild(s);
                tiles.push(s);
                stage.update();
            }
        }
    }
    function init() {
        drawTiles();
        window.playerImg = new Image();
        playerImg.onload = imgLoaded;
        playerImg.src = "Graphics/PlanetCute PNG/Character Boy Edited.png";
        
        window.enemImg = new Image();
        enemImg.onload = enemLoaded;
        enemImg.src = "Graphics/PlanetCute PNG/Character Horn Girl Edited.png";
    }
    init();
};
