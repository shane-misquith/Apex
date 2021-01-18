function myFunction(imgs) {
  var expandImg = document.getElementById("expandedImg");
  expandImg.src = imgs.src;
  expandImg.parentElement.style.display = "block";
}

function openContact(){
  document.body.classList.add("showLoginForm");
}
function closeContact(){
  document.body.classList.remove("showLoginForm");
}
