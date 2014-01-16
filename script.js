window.addEventListener('load', function(){
  Crafty.init();
  Crafty.background('#0000ff');

  var title = Crafty.e('2D, Canvas, Text, Keyboard')
        .attr({
          x: Crafty.stage.elem.clientWidth/2,
          y: Crafty.stage.elem.clientHeight/2
        })
        .text('GORILLAS')
        .textColor('#ffff00')
        .textFont({family: 'monospace', size: '50px'})
        .unselectable()
        .bind('KeyDown', function(){
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

  var angleName = Crafty.e('Label')
                        .attr({
                          x: 10,
                          y: 10
                        })
                        .text('Angle: ');

  var angleInput = Crafty.e('Input')
                         .attr({
                          x: angleName._w+10,
                          y: 10
                         })
                         .bind('KeyDown', function(e){
                          if(this._selected && e.key == Crafty.keys['ENTER']){
                            this.selected(false);
                            speedInput.selected(true);
                          }
                         })
                         .selected(true);

  var speedName = Crafty.e('Label')
                        .attr({
                          x: 10,
                          y: angleName._h+20
                        })
                        .text('Speed: ');

  var speedInput = Crafty.e('Input')
                         .attr({
                          x: speedName._w+10,
                          y: speedName._y
                         })
                         .bind('KeyDown', function(e){
                          if(this._selected && e.key == Crafty.keys['ENTER']){
                            Crafty.trigger('Fire', this._text, angleInput._text);
                          }
                         });
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
        .bind('Fire', function(s, a){
          if(this.isTurn()){
            Crafty.e('Banana')
                  .attr({
                    x: that._x+25,
                    y: that._y+25,
                  })
                  .velocity(s, a, this._position);
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
          w: 6,
          h: 6
        })
        .color('#ffff00')
        .gravity()
        .onHit('Building', function(){
          if(this.hit('Hole')) return;
          console.log('BOOM');
          Crafty.e('Hole')
                .attr({
                  x: this._x+this._w/2-30/2,
                  y: this._y+this._h/2-30/2,
                });
          this.destroy();
        });
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
          w: 30,
          h: 30
        })
        .color('#0000ff');
  }
});

Crafty.c('Label', {
  init: function(){
    this.requires('2D, Canvas, Text, Keyboard')
        .textColor('#ffffff');
  }
});

Crafty.c('Input', {
  _text: '',
  _selected: false,

  init: function(){
    this.requires('2D, Canvas, Text, Keyboard')
        .textColor('#ffffff')
        .bind('KeyDown', function(e){
          if(this._selected){
            if(e.key == Crafty.keys['BACKSPACE']){
              this._text = this._text.substring(0, this._text.length-1);
              this.text(this._text);
            } else if(this._text.length > 2){
              return;
            } else if(47 < e.key && e.key < 58){
              this._text += e.key-48;
              this.text(this._text);
            }
          }
        });
  },

  selected: function(b){
    this._selected = b;
  }
});
