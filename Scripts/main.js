window.onload = function() {
    canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    stage.enableMouseOver(10);
    
    function Player(x,y,img) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.bit = new Bitmap(img);
        this.bit.scaleX = this.bit.scaleY = 0.15;
        this.bit.x = this.x*32;
        this.bit.y = this.y*32;
        stage.addChild(this.bit);
    }
    
    window.tick = function() {
        stage.update();
    };
    function imgLoaded(e) {
        var p = new Player(0,0,this);
        players.push(p);
        stage.update();
        Ticker.setFPS(32);
        Ticker.addListener(window);
    }
    function init() {
        window.playerImg = new Image();
        playerImg.onload = imgLoaded;
        playerImg.src = "Graphics/SpaceCute PNG/girl5.png";
        window.players = [];
    }
    init();
};
