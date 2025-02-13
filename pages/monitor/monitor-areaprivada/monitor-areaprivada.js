document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuContainer.addEventListener("mouseenter", function () {
        dropdownMenu.style.display = "block";
    });

    menuContainer.addEventListener("mouseleave", function () {
        dropdownMenu.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {
        window.location.href = "../../web/home/inicio.html"; 
    });
});
