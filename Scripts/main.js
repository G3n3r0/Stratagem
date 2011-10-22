window.onload = function() {
    function findIndex(arr,val) {
        for(var i in arr) {
            if(arr[i] == val) {
                return i;
            }
        }
        return false;
    }
    Array.prototype.removeIt = function(val) {
        var s = findIndex(this,val);
        if(s!==false) {
            this.splice(s,1);
        }
    };
    window.characters = [];
    window.pos_chars = [];
    //var size = 40;
    var size = document.getElementById("c").width/8;
    canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    stage.enableMouseOver(10);
    var tiles = [];
    var players = [];
    var enems = [];
    function E(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    
    function Player(x,y,img,name) {
        this.type = "Player";
        this.x = x;
        this.y = y;
        this.health = 10;
        this.maxHealth = 10;
        this.atk = 1;
        this.name = name;
        this.img = img;
        this.range = 1;
        this.bit = new Bitmap(img);
        this.bit.scaleX = this.bit.scaleY = (size-2)/img.height;
        this.bit.x = this.x*size+(size-(img.width*this.bit.scaleX))/2;
        this.bit.y = this.y*size+2;
        this.bit.mouseEnabled = true;
        this.width = this.img.width*this.bit.scaleX;
        this.height = this.img.height*this.bit.scaleY;
        var that = this;
        this.bit.onClick = function(e2) {
            window.selectedPlayer = that;
            console.log("Derp");
            for(var i=0;i<tiles.length;i++) {
                var tile = tiles[i];
                console.log(Math.abs(tile.y/size-that.y), Math.abs(tile.x/size-that.x));
                console.log(tile.isOccupied);
                tile.mouseEnabled = false;
                tile.alpha = 0.125;
                if(Math.abs(tile.y/size-that.y)<=that.range && Math.abs(tile.x/size-that.x)<=that.range) {
                    tile.alpha = 0.5;
                    tile.mouseEnabled = true;
                    if(tile.isOccupied) {
                        //alert("Boomz");
                        //tile.isOccupied.bit.mouseEnabled = true;
                        //tile.isOccupied.bit.onClick = tile.onClick;
                    }
                }
            }
        };
        this.bit.onMouseOver = function(e) {
            canvas.title = "["+that.type+that.name+"]\nHealth: "+that.health/that.maxHealth*100+"%\nAttack: "+that.atk;
        };
        this.bit.onMouseOut = function(e3) {
                canvas.title = null;
            };
        this.update = function() {
            this.bit.x = this.x*size+(size-(img.width*this.bit.scaleX))/2;
            this.bit.y = this.y*size+2;
            //console.log(this.bit.x,this.bit.y);
        };
        //console.log(this.bit.x,this.bit.y);
        stage.addChild(this.bit);
        this.toString = function() {
            var ret = "Player"+(this.name||"")+"("+this.img.src+"). Located at square ("+this.x+", "+this.y+")";
            return ret;
        };
        return this;
    }
    
    function Character(imgSrc, type, atk, health, range) {
        this.imgSrc = imgSrc;
        this.type = type;
        this.atk = atk||1;
        this.health = health||10;
        this.range = range||1;
        console.log(this,this.range);
        this.toString = function() {
            return this.type+"("+this.imgSrc+")";
        };
        return this;
    }
    pos_chars.push(new Character("Graphics/PlanetCute PNG/Character Boy Edited.png","Boy"));
    pos_chars.push(new Character("Graphics/SpaceCute PNG/star.png","Star"));
    pos_chars.push(new Character("Graphics/SpaceCute PNG/planet_2.png","Planet",20,200,1));
    pos_chars.push(new Character("Graphics/SpaceCute PNG/healthheart.png","Heart"));
    function Enemy(x,y,img,name) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.name = name;
        var that = new Player(x,y,img,name);
        that.type = "Enemy";
        this.type = "Enemy";
        that.health = 8;
        that.maxHealth = 8;
        that.bit.onClick = null;
        //this.prototype = new Player(x,y,img,name);
        //var that = this;
        that.toString = function() {
            var ret = "Enemy"+(that.name||"")+"("+that.img.src+"). Located at square ("+that.x+", "+that.y+")";
            return ret;
        };
        this.that = that;
        return that;
    }
    
    function battle(a,b) {
        while(a.health>0 && b.health>0) {
            a.health -= b.atk;
            b.health -= a.atk;
        }
        if(a.health<=0) {
            stage.removeChild(a.bit);
            players.removeIt(a);
        }
        if(b.health<=0) {
            stage.removeChild(b.bit);
            enems.removeIt(b);
        }
    }
    
    window.tick = function() {
        for(var i=0;i<players.length;i++) {
            players[i].update();
        }
        for(var j=0;j<enems.length;j++) {
            enems[j].update();
        }
        for(var k=0;k<players.length;k++) {
            var a = {
                x: players[k].x*size,
                y: players[k].y*size,
                width: players[k].width,
                height: players[k].height
            };
            for(var m=0;m<enems.length;m++) {
                var b = {
                    x: enems[m].x*size,
                    y: enems[m].y*size,
                    width: enems[m].width,
                    height: enems[m].height
                };
                if(E(a,b)) {
                    //console.log("collided!");
                    battle(players[k], enems[m]);
                }
            }
        }
        stage.update();
    };
    function enemLoaded(e) {
        for(var i=0;i<canvas.width/size;i++) {
            var en = new Enemy(i,0,this," "+i.toString());
            enems.push(en);
        }
        for(var j in enems) {
            tiles[j].isOccupied = enems[j];
        }
        console.log(enems[0]);
    }
    function imgLoaded(e) {
        console.log(e,this);
        console.log(canvas.height,size);
        for(var i=this.num||0;i<canvas.width/size/characters.length+this.num;i++) {
            var p = new Player(i,canvas.height/size-1,this," "+i.toString());
            p.atk = this.char.atk;
            p.health = this.char.health;
            p.maxHealth = this.char.health;
            console.log(this.char.range);
            p.range = this.char.range;
            players.push(p);
        }
        /*var revTiles = tiles.reverse();
        var revPlayers = players.reverse();
        for(var j in revPlayers) {
            revTiles[j].isOccupied = revPlayers[j];
        }*/
        console.log(players[0].toString());
        stage.update();
        Ticker.setFPS(16);
        Ticker.addListener(window);
        document.getElementById("c").removeAttribute("class");
        document.getElementById("div1").style.display = "none";
        document.title = document.title.replace(/\(loading\.\.\.\)/gi,"");
    }
    function drawTiles() {
        //var size = 40;
        for(var i=0;i<canvas.height/size;i++) {
            for(var j=0;j<canvas.width/size;j++) {
                var g = new Graphics();
                g.beginStroke("#000");
                g.beginFill("rgba(255,255,255,1)");
                g.drawRect(0,0,size,size);
                var s = new Shape(g);
                s.x = j*size;
                s.y = i*size;
                s.isOccupied = false;
                s.mouseEnabled = false;
                s.alpha = 0.125;
                s.onClick = function(e) {
                    console.log("Derp^2");
                    //console.log(tiles[selectedPlayer.x*selectedPlayer.y-selectedPlayer.x]);
                    for(var k=0;k<tiles.length;k++) {
                        if(k.isOccupied==selectedPlayer) {
                            k.isOccupied = false;
                        }
                    }
                    window.selectedPlayer.x = this.x/size;
                    window.selectedPlayer.y = this.y/size;
                    s.isOccupied = window.selectedPlayer;
                    console.log(this,window.selectedPlayer);
                    for(var i=0;i<tiles.length;i++) {
                        if(tiles[i].mouseEnabled) {
                            tiles[i].mouseEnabled = false;
                            tiles[i].alpha = 0.125;
                        }
                    }
                    //selectedPlayer.update();
                };
                stage.addChild(s);
                tiles.push(s);
                stage.update();
            }
        }
    }
    function charSelect() {
        document.getElementById("c").removeAttribute("class");
        document.getElementById("div1").style.display = "none";
        document.title = document.title.replace(/\(loading\.\.\.\)/gi,"");
        
        for(var i=0;i<pos_chars.length;i++) {
            console.log(i);
            var char = pos_chars[i];
            var s = new Image();
            s.i = i;
            s.char = char;
            s.onload = function(e) {
                console.log(this.i);
                console.log(this);
                var b = new Bitmap(this);
                b.x = 10;
                b.y = this.i*size/1.5;
                b.scaleX = b.scaleY = (size-2)/1.5/this.height;
                b.mouseEnabled = true;
                var t = this;
                b.onClick = function(e2) {
                    if(characters.length<canvas.width/size) {
                        characters.push(t.char);
                        charsLeft -= 1;
                        clT.text = charsLeft.toString();
                        stage.update();
                    }
                    if(characters.length>=canvas.width/size) {
                        //but.visible = true;
                        //bu.visible = true;
                        bu.alpha = 1;
                        but.alpha = 1;
                        bu.mouseEnabled = but.mouseEnabled = true;
                        stage.update();
                    }
                    console.log(characters.length,canvas.width/size);
                };
                //b.scaleX = b.scaleY = 1/(this.i+1);
                stage.addChild(b);
                console.log(b);
                stage.update();
            }
            s.src = char.imgSrc;
        }
        var bW = 128;
        var bH = 64;
        var g = new Graphics();
        g.beginFill("green");
        g.drawRoundRect(0,0,bW,bH,10,10);
        var bu = new Shape(g);
        bu.x = canvas.width-bW;
        bu.y = canvas.height-bH;
        bu.alpha = 0.5;
        bu.onClick = function(e) {
            stage.removeAllChildren();
            init();
        };
        bu.mouseEnabled = false;
        
        var but = new Text("\u2714", "64px Arial", "#FFF");
        but.x = canvas.width-but.getMeasuredWidth()/2-bW/2;
        but.y = canvas.height-but.getMeasuredLineHeight()/2+bH/2;
        but.alpha = 0.5;
        but.onClick = bu.onClick;
        but.mouseEnabled = false;
        
        var charsLeft = canvas.width/size;
        var clT = new Text(charsLeft.toString(), "128px Arial", "#FFF");
        clT.x = canvas.width/2-clT.getMeasuredWidth()/2;
        clT.y = canvas.height/2;
        
        stage.addChild(bu);
        stage.addChild(but);
        stage.addChild(clT);
    }
    function titleScreen() {
        document.getElementById("c").removeAttribute("class");
        document.getElementById("div1").style.display = "none";
        document.title = document.title.replace(/\(loading\.\.\.\)/gi,"");
        var i = new Image();
        i.onload = function(e) {
            var b = new Bitmap(this);
            b.scaleX = b.scaleY = canvas.width/this.width;
            console.log(b.scaleX);
            b.x = 0;
            b.y = 0;
            b.mouseEnabled = true;
            b.onClick = function(e2) {
                stage.removeAllChildren();
                stage.update();
                charSelect();
            };
            stage.addChild(b);
            stage.update();
        };
        i.src = "Graphics/big_bang_game.png";
    }
    function init() {
        drawTiles();
        for(var i=0;i<characters.length;i++) {
            window.playerImg = new Image();
            playerImg.char = characters[i];
            playerImg.num = i*(canvas.width/size/characters.length);
            console.log(playerImg.num);
            playerImg.onload = imgLoaded;
            //playerImg.onload = function(e) {
            //    imgLoaded(e,i);
            //};
            playerImg.src = characters[i].imgSrc;
        }
        
        window.enemImg = new Image();
        enemImg.onload = enemLoaded;
        enemImg.src = "Graphics/PlanetCute PNG/Character Horn Girl Edited.png";
    }
    //init();
    //charSelect();
    titleScreen();
};
