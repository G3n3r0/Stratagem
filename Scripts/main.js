"\u2328";
window.onload = function() {
    window.scrollTo(0, 1);
    window.onscroll = function(e) {
        //alert(document.body.scrollTop);
        if(document.body.scrollTop>=0 && document.body.scrollTop<=25) {
            if(document.body.scrollTop<=0) {
                setTimeout(function() {
                    window.scrollTo(document.body.scrollLeft,1);
                }, 2000);
            } else {
                window.scrollTo(document.body.scrollLeft,1);
            }
        }
    };
    var sW = window.innerWidth;
    var sH = window.innerHeight;
    var spinner = document.getElementsByClassName("spinner")[0];
    var canvas = document.getElementById("c");
    if(sW>=1280 && sH>=960) {
        canvas.width = 1280;
        canvas.height = 960;
        spinner.setAttribute("class",spinner.getAttribute("class")+"large");
    } else if(sW>=960 && sH>=720) {
        canvas.width = 960;
        canvas.height = 720;
        spinner.setAttribute("class",spinner.getAttribute("class")+"mediu");
        //spinner.addClass("mediu");
    }
    document.onselectstart = function() {return false;}; // ie
    document.onmousedown = function() {return false;}; // mozilla
    window.curSymb = "\u264b";
    window.symbObj = {
            science: "\u269b",
            neutral: "\u2696",
            brute: "\u2692",
            magic: "\u2618"
        };
    window.money = 100;
    window.enemsLoaded = false;
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
    function pointer(e) {
        document.getElementById("c").style.cursor = "pointer";
    }
    function depointer(e) {
        document.getElementById("c").style.cursor = "default";
    }
    window.characters = [];
    window.pos_chars = [];
    window.pos_enems = [];
    
    window.sto_chars = [];
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
    
    function Player(x,y,img,name,elem) {
        this.type = "Player";
        this.x = x;
        this.y = y;
        this.health = 10;
        this.maxHealth = 10;
        this.atk = 1;
        this.name = name;
        this.elem = elem;
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
            //console.log("Derp");
            for(var i=0;i<tiles.length;i++) {
                var tile = tiles[i];
                //console.log(Math.abs(tile.y/size-that.y), Math.abs(tile.x/size-that.x));
                //console.log(tile.isOccupied);
                tile.mouseEnabled = false;
                tile.alpha = 0.125;
                if(Math.abs(tile.y/size-that.y)<=that.range && Math.abs(tile.x/size-that.x)<=that.range) {
                    tile.alpha = 0.5;
                    tile.mouseEnabled = true;
                    //if(tile.isOccupied) {
                        //alert("Boomz");
                        //tile.isOccupied.bit.mouseEnabled = true;
                        //tile.isOccupied.bit.onClick = tile.onClick;
                    //}
                }
            }
        };
        this.bit.onMouseOver = function(e) {
            canvas.title = "["+symbObj[this.image.char.elem]+that.type+that.name+"]\nHealth: "+that.health/that.maxHealth*100+"%\nAttack: "+that.atk;
            pointer();
        };
        this.bit.onMouseOut = function(e3) {
                canvas.title = null;
                depointer();
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
    
    function Character(imgSrc, type, description, atk, health, elem, cost, range) {
        this.imgSrc = imgSrc;
        this.type = type;
        this.atk = atk||1;
        this.health = health||10;
        this.elem = elem||"neutral";
        this.cost = cost||50;
        this.range = range||1;
        this.description = description||"";
        //console.log(this,this.range);
        this.toString = function() {
            return this.type+"("+this.imgSrc+")";
        };
        return this;
    }
    pos_chars.push(new Character("Graphics/PlanetCute PNG/Character Boy Edited.png","Boy", "Just a city boy.\nBorn and raised in South Detroit.\nHe took the midnight train, goin' anywhere.",null,null,"neutral"));
    pos_chars.push(new Character("Graphics/SpaceCute PNG/star.png","Star","Dancing with the stars",null,null,"science"));
    pos_chars.push(new Character("Graphics/SpaceCute PNG/healthheart.png","Heart","It's telltale.",null,null,"magic"));
    pos_chars.push(new Character("Graphics/sssoldierOnOwn2.png","Steven Barbera","In Soviet Russia, TV watch YOU!",null,null,"science"));
    pos_chars.push(new Character("Graphics/avatar-default.png","John Q Cummins","(845)-803-6670",null,null,"brute"));
    pos_chars.push(new Character("Graphics/doodler.png","Doodler","The character from the game that JUMPED the charts.",2,null,"magic"));
    pos_chars.push(new Character("Graphics/Octocat.png","Octocat","Commit the Kraken.",3,null,"science"));
    pos_chars.push(new Character("Graphics/Crystal_128_penguin.png","Tux","Installing Gentoo can be a TUXing procedure.",4,null,"science"));
    pos_chars.push(new Character("Graphics/zoidberg.png","Dr. Zoidberg","Looking for a character? Why not Zoidberg?(\\/)_(\u00B0,,,\u00B0)_(\\/)",4,null,"brute"));
    pos_chars.push(new Character("Graphics/sheldonCooper.png","Sheldor the Conqueror","[Sheldor is AFK]",5,null,"science"));
    
    pos_enems.push(new Character("Graphics/blackMage.png","Black Mage","Looks like the Jawas learned to use magic.",2,null,"magic"));
    pos_enems.push(new Character("Graphics/jawa.png","Jawa","OMG! It's a druuuuuuuuuuuuuuuurd!",2,null,"science"));
    pos_enems.push(new Character("Graphics/Inky.png","Inky","Pac-pac-pac-pac-pac-pac-pac-pac-weeoweeeooowee.",2,null,"brute"));
    pos_enems.push(new Character("Graphics/PlanetCute PNG/Character Horn Girl Edited.png","Girl","Just a small-town girl.\nLiving in a lonely world.\nShe took the midnight train, going anywhere.",2,null,"neutral"));
    
    sto_chars.push(new Character("Graphics/gilgamesh_3.png","Planet","We are the Mesopota-mi-ans.\nSargon, Hammurabi, Ashurbanipal and Gilgamesh.",3,15,"brute",50));
    sto_chars.push(new Character("Graphics/SpaceCute PNG/planet_2.png","Planet","It's the same size as your mom. Bazinga!",20,200,"science",101));
    sto_chars.push(new Character("Graphics/spinning_beach_ball_sharpened.gif","Steve Jobs","\"No, my life didn't flash before my eyes. Apple doesn't support Flash.\"",20,200,"science",100));
    
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
        that.bit.onMouseOver = null;
        that.bit.onMouseOut = null;
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
        var atk = Number(a.atk.toString());
        var etk = Number(b.atk.toString());
        if((a.elem=="science" && b.elem=="magic") || (a.elem=="magic" && b.elem=="brute") || (a.elem=="brute" && b.elem=="science")) {
            console.log("A has the advantage!");
            atk *= 1.5;
        }
        if((b.elem=="science" && a.elem=="magic") || (b.elem=="magic" && a.elem=="brute") || (b.elem=="brute" && a.elem=="science")) {
            console.log("B has the advantage!");
            etk *= 1.5;
        }
        console.log(a.elem,b.elem,a.atk,b.atk);
        console.log("atk: ", atk, "etk: ", etk);
        while(a.health>0 && b.health>0) {
            //a.health -= b.atk;
            //b.health -= a.atk;
            a.health -= etk;
            b.health -= atk;
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
        if(enems.length<=0 && enemsLoaded) {
            //setTimeout(function() {
            money += 100;
            stage.removeAllChildren();
            titleScreen();
            enemsLoaded = false;
            //},1000);
        }
        stage.update();
    };
    function calcEuc(x1,y1,x2,y2) {
        var ret = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
        return ret;
    }
    function enemTurn(enemArr, playerArr) {
        var tempArr = [];
        for(var i=0;i<enemArr.length;i++) {
            var enem = enemArr[i];
            var tempArr2 = [];
            for(var j=0;j<playerArr.length;j++) {
                var player = playerArr[i];
                console.log(enem, enem.x, enem.y);
                tempArr2.push([enem,calcEuc(player.x,player.y,enem.x,enem.y),player]);
            }
            tempArr.push(tempArr2);
        }
        var tempArr3 = [];
        for(var k=0;k<tempArr.length;k++) {
            tempArr[k].sort(function(a,b) {
                return (a[1]-b[1]);
            });
            tempArr3.push(tempArr[k][0]);
        }
        //console.log(tempArr3
        tempArr3.sort(function(a,b) {
            return (a[1]-b[1]);
        });
        console.log(tempArr3);
        var final = tempArr3[0];
        var finalP = final[2];
        var finalE = final[0];
        if(finalE.x<finalP.x && finalE.x<canvas.width/size-1) {
            finalE.x += 1;
        } else if(finalE.x>finalP.x && finalE.x>0) {
            finalE.x -= 1;
        }
        if(finalE.y<finalP.y && finalE.y<canvas.height/size-1) {
            finalE.y += 1;
        } else if(finalE.y>finalP.y && finalE.y>0) {
            finalE.y -= 1;
        }
        finalE.update();
    }
    function enemLoaded(e) {
        /*for(var i=0;i<canvas.width/size;i++) {
            var en = new Enemy(i,0,this," "+i.toString());
            en.elem = "magic";
            console.log(en.elem);
            enems.push(en);
        }*/
        console.log("num",this.num);
        for(var i=this.num||0;i<canvas.width/size/enem_chars.length+this.num;i++) {
            var en = new Enemy(i,0,this," "+i.toString());
            en.atk = this.char.atk;
            en.health = this.char.health;
            en.elem = "magic";
            en.range = this.char.range;
            console.log(en.elem);
            enems.push(en);
        }
        window.enemsLoaded = true;
        /*for(var j in enems) {
            tiles[j].isOccupied = enems[j];
        }*/
        //console.log(enems[0]);
        //enems[2].y = 3;
        //enems[2].bit.y = 3*size;
    }
    function imgLoaded(e) {
        //console.log(e,this);
        //console.log(canvas.height,size);
        for(var i=this.num||0;i<canvas.width/size/characters.length+this.num;i++) {
            var p = new Player(i,canvas.height/size-1,this," "+i.toString());
            p.atk = this.char.atk;
            p.health = this.char.health;
            p.maxHealth = this.char.health;
            p.elem = this.char.elem;
            //console.log(this.char.range);
            p.range = this.char.range;
            players.push(p);
        }
        /*var revTiles = tiles.reverse();
        var revPlayers = players.reverse();
        for(var j in revPlayers) {
            revTiles[j].isOccupied = revPlayers[j];
        }*/
        //console.log(players[0].toString());
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
                    //console.log("Derp^2");
                    //console.log(tiles[selectedPlayer.x*selectedPlayer.y-selectedPlayer.x]);
                    for(var k=0;k<tiles.length;k++) {
                        if(k.isOccupied==selectedPlayer) {
                            k.isOccupied = false;
                        }
                    }
                    window.selectedPlayer.x = this.x/size;
                    window.selectedPlayer.y = this.y/size;
                    selectedPlayer.update();
                    s.isOccupied = window.selectedPlayer;
                    //console.log(this,window.selectedPlayer);
                    for(var i=0;i<tiles.length;i++) {
                        if(tiles[i].mouseEnabled) {
                            tiles[i].mouseEnabled = false;
                            tiles[i].alpha = 0.125;
                        }
                    }
                    /*var a = {
                        x: selectedPlayer.x*size,
                        y: selectedPlayer.y*size,
                        width: selectedPlayer.width,
                        height: selectedPlayer.height
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
                           battle(window.selectedPlayer, enems[m]);
                       }
                    }*/
                    //selectedPlayer.update();
                    enemTurn(enems,players);
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
        var q = [];
        for(var m=0;m<pos_chars.length;m+=canvas.width/size) {
            q.push(pos_chars.slice(m,m+canvas.width/size));
        }
        //console.log(q);
        for(var i=0;i<q.length;i++) {
            for(var j=0;j<q[i].length;j++) {
                //console.log(i,j);
                //var char = pos_chars[i];
                var char = q[i][j];
                //console.log(char);
                var s = new Image();
                s.i = i;
                s.j = j;
                s.char = char;
                s.onload = function(e) {
                    //console.log(this.i,this.j);
                    //console.log(this);
                    var b = new Bitmap(this);
                    b.x = 10+this.i*size/1.5;
                    b.y = this.j*size/1.5;
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
                        //console.log(characters.length,canvas.width/size);
                    };
                    b.onMouseOver = function(e2) {
                        pointer();
                        //console.log(this);
                        canvas.title = symbObj[this.image.char.elem]+this.image.char.type+"\n"+this.image.char.description;
                    };
                    b.onMouseOut = function(e2) {
                        canvas.title = null;
                        depointer();
                    };
                    //b.scaleX = b.scaleY = 1/(this.i+1);
                    stage.addChild(b);
                    //console.log(b);
                    stage.update();
                };
                s.src = char.imgSrc;
            }
        }
        var bW = size/1.5*2;
        var bH = size/1.5;
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
        bu.onMouseOver = pointer;
        bu.onMouseOut = depointer;
        bu.mouseEnabled = false;
        
        var buts = 64*(canvas.width/640);
        
        var but = new Text("\u2714", buts+"px Arial", "#FFF");
        but.x = canvas.width-but.getMeasuredWidth()/2-bW/2;
        but.y = canvas.height-but.getMeasuredLineHeight()/2+bH/2;
        but.alpha = 0.5;
        but.visible = false;
        but.onClick = bu.onClick;
        but.onMouseOver = bu.onMouseOver;
        but.onMouseOut = bu.onMouseOut;
        but.mouseEnabled = false;
        
        var h = new Graphics();
        h.beginFill("yellow");
        h.drawRoundRect(0,0,bW,bH,10,10);
        var bu2 = new Shape(h);
        bu2.x = 0;
        bu2.y = canvas.height-bH;
        //bu.alpha = 0.5;
        bu2.onClick = function(e) {
            //stage.removeAllChildren();
            //init();
            titleScreen();
        };
        bu2.onMouseOver = pointer;
        bu2.onMouseOut = depointer;
        
        var charsLefts = 128*(canvas.width/640);
        
        var charsLeft = canvas.width/size;
        var clT = new Text(charsLeft.toString(), charsLefts+"px Arial", "#FFF");
        clT.x = canvas.width/2-clT.getMeasuredWidth()/2;
        clT.y = canvas.height/2;
        
        stage.addChild(bu);
        stage.addChild(but);
        stage.addChild(bu2);
        stage.addChild(clT);
    }
    function updateMoneyText(moneyObj) {
        moneyObj.text = curSymb+money.toString();
        monT.x = canvas.width-monT.getMeasuredWidth();
        monT.y = monT.getMeasuredLineHeight();
        stage.addChild(monT);
    }
    function store() {
        document.getElementById("c").removeAttribute("class");
        document.getElementById("div1").style.display = "none";
        document.title = document.title.replace(/\(loading\.\.\.\)/gi,"");
        var q = [];
        for(var m=0;m<sto_chars.length;m+=canvas.width/size) {
            q.push(sto_chars.slice(m,m+canvas.width/size));
        }
        //console.log(q);
        for(var i=0;i<q.length;i++) {
            for(var j=0;j<q[i].length;j++) {
                //console.log(i,j);
                //var char = pos_chars[i];
                var char = q[i][j];
                //console.log(char);
                var s = new Image();
                s.i = i;
                s.j = j;
                s.char = char;
                s.onload = function(e) {
                    //console.log(this.i,this.j);
                    //console.log(this);
                    var b = new Bitmap(this);
                    b.x = 10+this.i*size/1.5;
                    b.y = this.j*size/1.5;
                    b.scaleX = b.scaleY = (size-2)/1.5/this.height;
                    b.mouseEnabled = true;
                    var t = this;
                    b.onClick = function(e2) {
                        /*if(characters.length<canvas.width/size) {
                            //characters.push(t.char);
                            //charsLeft -= 1;
                            //clT.text = charsLeft.toString();
                            //stage.update();
                        }
                        if(characters.length>=canvas.width/size) {
                            //but.visible = true;
                            //bu.visible = true;
                            //bu.alpha = 1;
                            //but.alpha = 1;
                            //bu.mouseEnabled = but.mouseEnabled = true;
                            //stage.update();
                        }*/
                        //console.log(characters.length,canvas.width/size);
                        if(window.money>=t.char.cost) {
                            window.money-=t.char.cost;
                            updateMoneyText(monT);
                            t.char.bought = true;
                            b.mouseEnabled = false;
                            b.alpha = 0.5;
                            pos_chars.push(t.char);
                            stage.update();
                        }
                    };
                    b.onMouseOver = function(e2) {
                        pointer();
                        //console.log(this);
                        canvas.title = curSymb+this.image.char.cost+"\n"+symbObj[this.image.char.elem]+this.image.char.type+"\n"+this.image.char.description;
                    };
                    b.onMouseOut = function(e2) {
                        canvas.title = null;
                        depointer();
                    };
                    if(this.char.bought) {
                        b.alpha = 0.5;
                        b.mouseEnabled = false;
                    }
                    //b.scaleX = b.scaleY = 1/(this.i+1);
                    stage.addChild(b);
                    //console.log(b);
                    stage.update();
                };
                s.src = char.imgSrc;
            }
        }
        var bW = size/1.5*2;
        var bH = size/1.5;
        var g = new Graphics();
        g.beginFill("yellow");
        g.drawRoundRect(0,0,bW,bH,10,10);
        var bu = new Shape(g);
        bu.x = 0;
        bu.y = canvas.height-bH;
        //bu.alpha = 0.5;
        bu.onClick = function(e) {
            //stage.removeAllChildren();
            //init();
            titleScreen();
        };
        bu.onMouseOver = pointer;
        bu.onMouseOut = depointer;
        //bu.mouseEnabled = false;
        
        var buts = 64*(canvas.width/640);
        
        var but = new Text("\u2714", buts+"px Arial", "#FFF");
        but.x = canvas.width-but.getMeasuredWidth()/2-bW/2;
        but.y = canvas.height-but.getMeasuredLineHeight()/2+bH/2;
        but.alpha = 0.5;
        but.visible = false;
        but.onClick = bu.onClick;
        but.onMouseOver = bu.onMouseOver;
        but.onMouseOut = bu.onMouseOut;
        but.mouseEnabled = false;
        
        var monTs = 24*(canvas.width/640);
        
        /*var charsLeft = canvas.width/size;
        var clT = new Text(charsLeft.toString(), charsLefts+"px Arial", "#FFF");
        clT.x = canvas.width/2-clT.getMeasuredWidth()/2;
        clT.y = canvas.height/2;*/
        
        window.monT = new Text(curSymb+money.toString(), monTs+"px Ubuntu","#FFF");
        monT.x = canvas.width-monT.getMeasuredWidth();
        monT.y = monT.getMeasuredLineHeight();
        stage.addChild(monT);
        
        stage.addChild(bu);
        stage.addChild(but);
        //stage.addChild(clT);
    }

    function titleScreen() {
        document.getElementById("c").removeAttribute("class");
        document.getElementById("div1").style.display = "none";
        document.title = document.title.replace(/\(loading\.\.\.\)/gi,"");
        var i = new Image();
        i.onload = function(e) {
            var b = new Bitmap(this);
            b.scaleX = b.scaleY = canvas.width/this.width;
            //console.log(b.scaleX);
            b.x = 0;
            b.y = 0;
            /*b.mouseEnabled = true;
            b.onClick = function(e2) {
                stage.removeAllChildren();
                stage.update();
                //charSelect();
                store();
            };*/
            stage.addChild(b);
            
            var t1s = 120*(canvas.width/640);
            var t2s = 48*(canvas.width/640);
            
            var t1 = new Text("Stratagem", t1s+"px Ubuntu, Helvetica, Arial, sans-serif", "#FFF");
            t1.x = canvas.width/2-t1.getMeasuredWidth()/2;
            t1.y = canvas.height/2-t1.getMeasuredLineHeight()/2;
            stage.addChild(t1);
            var t2 = new Text("The game for those of us smarter than Newton.", t2s+"px Ubuntu, Helvetica, Arial, sans-serif", "#FFF");
            t2.lineWidth = canvas.width;
            t2.textAlign = "center";
            //t2.x = Math.abs((canvas.width/2-t2.getMeasuredWidth()/2)/4);
            t2.x = canvas.width/2;
            //console.log(t2.x);
            //t2.x = 0;
            t2.y = canvas.height/2+t2.getMeasuredLineHeight()/4;
            stage.addChild(t2);
            
            var bW = size/1.5*2;
            var bH = size/1.5;
            var g = new Graphics();
            g.beginFill("yellow");
            g.drawRoundRect(0,0,bW,bH,10,10);
            var bu = new Shape(g);
            bu.x = t2.x+t2.x/4;
            bu.y = t2.y+t2.getMeasuredLineHeight()+5;
            bu.onClick = function(e) {
                stage.removeAllChildren();
                stage.update();
                store();
            };
            bu.onMouseOver = pointer;
            bu.onMouseOut = depointer;
            stage.addChild(bu);
            
            var h = new Graphics();
            h.beginFill("green");
            h.drawRoundRect(0,0,bW,bH,10,10);
            var bu2 = new Shape(h);
            bu2.x = t2.x/2;
            bu2.y = t2.y+t2.getMeasuredLineHeight()+5;
            bu2.onClick = function(e) {
                stage.removeAllChildren();
                stage.update();
                charSelect();
            };
            bu2.onMouseOver = pointer;
            bu2.onMouseOut = depointer;
            stage.addChild(bu2);
            
            stage.update();
        };
        i.src = "Graphics/big_bang_game_sharp.png";
    }
    window.enem_chars = [];
    function init() {
        drawTiles();
        for(var i=0;i<characters.length;i++) {
            window.playerImg = new Image();
            playerImg.char = characters[i];
            playerImg.num = i*(canvas.width/size/characters.length);
            //console.log(playerImg.num);
            playerImg.onload = imgLoaded;
            //playerImg.onload = function(e) {
            //    imgLoaded(e,i);
            //};
            playerImg.src = characters[i].imgSrc;
        }
        //var s = 0;
        for(var j=0,s=0;j<canvas.width/size;j++,s++) {
            //s = j;
            if(s>=pos_enems.length) {
                console.log("Resetting s");
                s = 0;
            }
            console.log("s",s,"j",j,pos_enems.length,(s>=pos_enems.length));
            enem_chars.push(pos_enems[s]);
        }
        console.log(enems,enem_chars);
        
        //window.enemImg = new Image();
        //enemImg.onload = enemLoaded;
        //enemImg.src = "Graphics/PlanetCute PNG/Character Horn Girl Edited.png";
        for(var k=0;k<enem_chars.length;k++) {
            window.enemImg = new Image();
            enemImg.char = enem_chars[k];
            console.log("enem_chars[k]", enem_chars[k]);
            enemImg.num = k*(canvas.width/size/enem_chars.length);
            console.log(enemImg.num);
            enemImg.onload = enemLoaded;
            //enemImg.src = "Graphics/PlanetCute PNG/Character Horn Girl Edited.png";
            enemImg.src = enem_chars[k].imgSrc;
        }
    }
    //init();
    //charSelect();
    titleScreen();
};
