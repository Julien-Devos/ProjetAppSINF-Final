window.addEventListener('load', function() {

    // Make a smooth fade in when the page load
    function fade(element) {
        var op = 0.1;  // initial opacity
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }

    fade(document.getElementById("body"))



    // Apply dark theme or light theme when button is clicked
    let themeBtn = document.getElementById("theme-toggle");
    let themetxt = document.getElementById("theme-txt");
    let icon = document.getElementById("theme-icon");

    if (themeBtn !== null){
        themeBtn.onclick = function (){
            document.body.classList.toggle("dark-theme");
            if(document.body.classList.contains("dark-theme")){
                themetxt.textContent = "Mode jour";
                icon.classList.toggle("icon-Light-Mode");
                icon.classList.remove("icon-Dark-Mode");
            }
            else{
                themetxt.textContent = "Mode nuit";
                icon.classList.toggle("icon-Dark-Mode");
                icon.classList.remove("icon-Light-Mode");
            }
        }
    }


    // prevent leaving the dropdown-menu when clicking on it
    $(function() {

        $('.dropdown-menu').on('click', function(event) {
            event.stopPropagation();
        });

    });

});