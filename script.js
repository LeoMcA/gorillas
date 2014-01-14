window.addEventListener('load', function(){
  Crafty.init();
  Crafty.background('#0000ff');

  var title = Crafty.e('2D, Canvas, Text, Mouse')
        .attr({
          x: Crafty.stage.elem.clientWidth/2,
          y: Crafty.stage.elem.clientHeight/2
        })
        .text('GORILLAS')
        .textColor('#ffff00')
        .textFont({family: 'monospace', size: '50px'})
        .unselectable()
        .bind('Click', function(){
          Crafty.scene('Game');
        });

        title.x -= title._w/2;
        title.y -= title._h/2;
});

/*---------------------------------------------*\

  Functions

\*---------------------------------------------*/

function toHex(dec){
  return (dec<16)?'0'+dec.toString(16):dec.toString(16);
}

function vectorX(s, a){
  return s*Math.cos(Crafty.math.degToRad(a-90))
}

function vectorY(s, a){
  return s*Math.sin(Crafty.math.degToRad(a-90))
}

/*---------------------------------------------*\

  Scenes

\*---------------------------------------------*/

Crafty.scene('Game', function(){
  // first create buildings
  buildings = [];
  var buildingsWidth = 0;

  while(buildingsWidth < Crafty.stage.elem.clientWidth){
    var building = Crafty.e('Building')
        .attr({
          x: buildingsWidth,
          y: Crafty.stage.elem.clientHeight,
          w: Crafty.math.randomInt(5, 10)*10,
          h: Crafty.math.randomInt(10, 50)*10
        });
        building.y -= building._h;

    buildings.push({
      x: building._x,
      y: building._y,
      w: building._w,
      h: building._h
    });
    buildingsWidth += building._w;
  }

  // now, put the gorillas on the buildings
  var gLeft = Crafty.e('Gorilla')
                    .attr({
                      x: buildings[1].x+buildings[1].w/2-25,
                      y: buildings[1].y-50
                    });
  var gRight = Crafty.e('Gorilla')
                     .attr({
                       x: buildings[buildings.length-2].x+buildings[buildings.length-2].w/2-25,
                       y: buildings[buildings.length-2].y-50
                     })
                     .position('right');

  // make it the left gorilla's turn
  gLeft.isTurn(true);
});

/*---------------------------------------------*\

  Components

\*---------------------------------------------*/

Crafty.c('Gorilla', {
  _isTurn: false,
  _position: 'left',

  isTurn: function(b){
    if(b !== undefined) this._isTurn = b;
    return this._isTurn;
  },

  position: function(p){
    if(p == 'right') this._position = 'right';
  },

  init: function(){
    var that = this;

    this.requires('2D, Canvas, Color, Keyboard')
        .attr({
          w: 50,
          h: 50
        })
        .color('#ffffaa')
        .bind('KeyDown', function(e){
          if(this.isTurn()){
            Crafty.e('Banana')
                  .attr({
                    x: that._x+25,
                    y: that._y+25
                  })
                  .velocity(10, 40, this._position);
            this.isTurn(false);
          } else {
            this.isTurn(true);
          }
        });
  }
});

Crafty.c('Banana', {
  init: function(){
    this.requires('2D, Canvas, Color, Gravity, Collision')
        .attr({
          w: 5,
          h: 5
        })
        .color('#ffff00')
        .gravity()
        .onHit('Building', function(){
          if(this.hit('Hole')) return;
          console.log('BOOM');
          Crafty.e('Hole')
                .attr({
                  x: this._x-10,
                  y: this._y-10
                });
          this.destroy();
        });;
  },

  velocity: function(s, a, pos){
    if(pos == 'right') a *= -1;
    this.bind('EnterFrame', function(){
          this.x += vectorX(s, a),
          this.y += vectorY(s, a)
        });
  }
});

Crafty.c('Building', {
  init: function(){
    this.requires('2D, Canvas, Color')
        .color('#' + toHex(Crafty.math.randomInt(0, 255)) + toHex(Crafty.math.randomInt(0, 255)) + '00');
  }
});

Crafty.c('Hole', {
  init: function(){
    this.requires('2D, Canvas, Color')
        .attr({
          w: 20,
          h: 20
        })
        .color('#0000ff');
  }
})
