window.addEventListener('load', function(){
  Crafty.init();
  Crafty.background('#0000ff');

  Crafty.e('2D, Canvas, Text')
        .attr({x: Crafty.stage.elem.clientWidth/2, y: Crafty.stage.elem.clientHeight/2})
        .text('MONKEYS')
        .textColor('#ffff00')
        .textFont({family: 'monospace', size: '100px', })
        .unselectable();
});

/*---------------------------------------------*\

  Components

\*---------------------------------------------*/

Crafty.c('Gorilla', {

});

Crafty.c('Banana', {

});

Crafty.c('Building', {

});
