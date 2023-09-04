$(document).ready(function () {
  var socket = io.connect("http://localhost:3000");

  socket.on("base", function (message) {
    console.log(message);
    var height = message.height;
    var width = message.width;
    var pixel_clicked = message.pixel_clicked;

    $("#img").attr("src", message.image);
    $(".game").css({
      width: width,
      height: height,
    });
    $(".infos").css({
      width: width,
    });
    $(".game").append(
      "<canvas id='allsPixel' class='allsPixel' width='" +
        width +
        "' height='" +
        height +
        "'></canvas>"
    );
    $("#nbr_pixel").text(parseInt(pixel_clicked.length));
    $("#nbr_user").text(parseInt(message.clients.length));

    var c = document.getElementById("allsPixel");
    var ctx = c.getContext("2d");
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
    my_gradient.addColorStop(0, "#F1C40E");
    my_gradient.addColorStop(1, "#ba980d");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, width, height);
    for (var p = 0; p < pixel_clicked.length; p++) {
      ctx.clearRect(pixel_clicked[p].x, pixel_clicked[p].y, 10, 10);
    }
    ctx.stroke();

    socket.on("delete", function (pixel) {
      ctx.clearRect(pixel.cell.x, pixel.cell.y, 10, 10);
      $("#nbr_pixel").text(parseInt(pixel.pixel_clicked.length));
    });

    socket.on("user", function (user) {
      $("#nbr_user").text(parseInt(user.length));
    });

    $("#allsPixel").click(function (e) {
      newX = Math.round((e.offsetX - 5) / 10) * 10;
      newY = Math.round((e.offsetY - 5) / 10) * 10;

      ctx.clearRect(newX, newY, 10, 10);

      socket.emit("message", {
        cell: {
          x: newX,
          y: newY,
        },
      });
    });
  });
});
