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
    var building = Crafty.e('2D, Canvas, Building, Color')
        .attr({
          x: buildingsWidth,
          y: Crafty.stage.elem.clientHeight,
          w: Crafty.math.randomInt(5, 10)*10,
          h: Crafty.math.randomInt(10, 50)*10
        })
        .color('#' + toHex(Crafty.math.randomInt(0, 255)) + toHex(Crafty.math.randomInt(0, 255)) + '00')
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
  Crafty.e('Gorilla');
});

/*---------------------------------------------*\

  Components

\*---------------------------------------------*/

Crafty.c('Gorilla', {
  init: function(){
    var that = this;

    this.requires('2D, Canvas, Color, Mouse')
        .attr({
          x: buildings[1].x+buildings[1].w/2-25,
          y: buildings[1].y-50,
          w: 50,
          h: 50
        })
        .color('#ffffaa')
        .bind('Click', function(){
          Crafty.e('Banana')
                .attr({
                  x: that._x+25,
                  y: that._y+25
                })
                .velocity(prompt('Speed'), prompt('Angle'));
        });
  }
});

Crafty.c('Banana', {
  init: function(){
    this.requires('2D, Canvas, Color, Gravity')
        .attr({
          w: 5,
          h: 5
        })
        .color('#00ffff')
        .gravity();
  },

  velocity: function(s, a){
    this.bind('EnterFrame', function(){
          this.x += vectorX(s, a),
          this.y += vectorY(s, a)
        })
  }
});

Crafty.c('Building', {
});
