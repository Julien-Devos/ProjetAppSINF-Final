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

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }



    // Apply dark theme or light theme when button is clicked
    let themeBtn = document.getElementById("theme-toggle");
    let themetxt = document.getElementById("theme-txt");
    let icon = document.getElementById("theme-icon");
    let theme = getCookie("theme");

    if (theme === "dark"){
        document.body.classList.toggle("dark-theme");
        themetxt.textContent = "Mode jour";
        icon.classList.toggle("icon-Light-Mode");
        icon.classList.remove("icon-Dark-Mode");
    }
    if (themeBtn !== null){
        themeBtn.onclick = function (){
            document.body.classList.toggle("dark-theme");
            if(document.body.classList.contains("dark-theme")){
                setCookie("theme","dark")
                themetxt.textContent = "Mode jour";
                icon.classList.toggle("icon-Light-Mode");
                icon.classList.remove("icon-Dark-Mode");
            }
            else{
                setCookie("theme","light")
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