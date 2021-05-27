var socket = io.connect();

var color = '#000000'
var stroke = 10

function clearit() {
   socket.emit('clearit', true);
}

function purple() {
   color = '#834baa';
}

function pink() {
   color = '#c62f6a';
}

function canard() {
   color = '#1b9b92';
}

function orange() {
   color = '#ff914d';
}

function yellow() {
   color = '#ffde59';
}

function black() {
   color = '#000000';
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = stroke;
} 

document.addEventListener("DOMContentLoaded", function () {
   var mouse = {
      click: false,
      move: false,
      pos: { x: 0, y: 0 },
      pos_prev: false
   };
   // get canvas element and create context
   var canvas = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width = window.innerWidth;
   var height = window.innerHeight;
   // var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function (e) { mouse.click = true; };
   canvas.onmouseup = function (e) { mouse.click = false; };

   canvas.onmousemove = function (e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

   // draw line received from server
   socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line.pos.x * width, line.pos.y * height);
      context.lineTo(line.prev.x * width, line.prev.y * height);
      context.lineCap = 'round';
      context.strokeStyle = line.color;
      context.lineWidth = line.stroke;
      context.stroke();
   });

   socket.on('clearit', function () {
      context.clearRect(0, 0, width, height);
      console.log("client clearit");
   })


   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing

      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         //socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, color ] });
         socket.emit('draw_line', {
            line: {
               pos: mouse.pos,
               prev: mouse.pos_prev,
               color: color,
               stroke: stroke,
            }
         });
         mouse.move = false;
      }

      mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});