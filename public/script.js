pulse = document.getElementById("pulse");
toggler = document.getElementById("toggler");
toggler.addEventListener("click", expandCircle);

function expandCircle() {
  const circle = document.getElementById("circle");
  const rocket = document.getElementById("rocket");

  circle.classList.toggle("expand");
  rocket.classList.toggle("launch");
  pulse.classList.toggle("hide");
}
