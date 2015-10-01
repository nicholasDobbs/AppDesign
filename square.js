function pageLoaded()
{
  var d = document.getElementById("square")
  var duration = 1000;
  d.onclick = function() { duration = duration/2; };
  function blink( blue ) {
    var green = true;
    var color = blue ? "blue" : (green ? "green" : "yellow");
    d.style.backgroundColor = color;
    window.setTimeout( blink, duration, !blue );
  }
  window.setTimeout( blink, duration, true );
}
