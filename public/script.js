const pulse = document.getElementById("pulse");
const toggler = document.getElementById("toggler");
toggler.addEventListener("click", expandCircle);

function expandCircle() {
  const circle = document.getElementById("circle");
  const rocket = document.getElementById("rocket");
  circle.classList.toggle("expand");
  rocket.classList.toggle("launch");
  pulse.classList.toggle("hide");

  const hiddenContent = document.querySelectorAll(".circle .hidden-content");
  hiddenContent.forEach((element) => {
    element.classList.toggle("show-content-animation");
  });

  const title = document.getElementById("title");
  const suggestions = document.getElementById("suggestions");
  const chatInput = document.getElementById("chat-input");
  title.classList.toggle("animation");
  suggestions.classList.toggle("animation");
  chatInput.classList.toggle("animation");
}

function restartPage() {
  window.location.reload();
}

// info page
function showInfo() {
  const infoPage = document.getElementById("info_page");
  const introSection = document.querySelector(".intro");

  introSection.classList.add("active");
  infoPage.classList.add("active");

  document.querySelector(".chatbox").classList.remove("active");
  document.getElementById("quiz").classList.remove("active");
  document.getElementById("our-school-container").style.display = "none";
}
