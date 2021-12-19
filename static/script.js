// Found on https://www.w3schools.com/js/js_cookies.asp
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
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Make a smooth fade in when the page load
function fade(element) {
    let op = 0.1;
    element.style.display = 'block';
    let timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

window.addEventListener('load', () => {


    fade(document.getElementById("body"))


    // used to show password in login forms
    let showBtn = document.getElementById("logPass");
    let showBtn2 = document.getElementById("regPass1");
    let showBtn3 = document.getElementById("regPass2");
    let passInput = document.getElementById("password");
    let passInput2 = document.getElementById("passwordConf");
    let eyeIcon = document.querySelector(".icon-eye-slash");
    let eyeIcon2 = document.querySelector("#regPass2 .icon-eye-slash");
    function togglePassword(input,icon) {
        if (input.type === "password"){
            input.type = "text";
        }
        else{
            input.type = "password";
        }
        icon.classList.toggle("icon-eye-slash");
        icon.classList.toggle("icon-eye");
    }
    if (showBtn !== null){
        showBtn.onclick = () => {
            togglePassword(passInput,eyeIcon)
        }
    }
    if (showBtn2 !== null){
        showBtn2.onclick = () => {
            togglePassword(passInput,eyeIcon)
        }
    }
    if (showBtn3 !== null){
        showBtn3.onclick = () => {
            togglePassword(passInput2,eyeIcon2)
        }
    }



    let showPassBtn = document.getElementById("profilePass");
    let profilePassInput = document.getElementById("password");
    let profileEyeIcon = document.querySelector(".icon-eye");
    if (showPassBtn !== null){
        let password = profilePassInput.placeholder;
        profilePassInput.placeholder = "*".repeat(password.length);
        profileEyeIcon.classList.toggle("icon-eye");
        profileEyeIcon.classList.toggle("icon-eye-slash");
        showPassBtn.onclick = () => {
            if (profilePassInput.placeholder === password){
                profilePassInput.placeholder = "*".repeat(password.length);
            } else{
                profilePassInput.placeholder = password;
            }
            profileEyeIcon.classList.toggle("icon-eye-slash");
            profileEyeIcon.classList.toggle("icon-eye");
        }
    }



    // Apply dark theme or light theme when button is clicked
    let themeBtn = document.getElementById("theme-toggle");
    let themetxt = document.getElementById("theme-txt");
    let icon = document.getElementById("theme-icon");
    let logo = document.getElementById("logo");
    let theme = getCookie("theme");

    if (theme === "dark"){
        document.body.classList.toggle("dark-theme");
        logo.src = "/img/logos/dark-logo.svg"
        if (themetxt != null){
            themetxt.textContent = "Mode jour";
            icon.classList.toggle("icon-Light-Mode");
            icon.classList.remove("icon-Dark-Mode");
        }
    }
    if (themeBtn !== null){
        themeBtn.onclick = function (){
            document.body.classList.toggle("dark-theme");
            if(document.body.classList.contains("dark-theme")){
                setCookie("theme","dark")
                logo.src = "/img/logos/dark-logo.svg"
                if (themetxt != null){
                    themetxt.textContent = "Mode jour";
                    icon.classList.toggle("icon-Light-Mode");
                    icon.classList.remove("icon-Dark-Mode");
                }
            }
            else{
                setCookie("theme","light")
                logo.src = "/img/logos/light-logo.svg"
                if (themetxt != null){
                    themetxt.textContent = "Mode nuit";
                    icon.classList.toggle("icon-Dark-Mode");
                    icon.classList.remove("icon-Light-Mode");
                }
            }
        }
    }



    // used to submit profile picture when changed on profile page
    let formFile = document.getElementById("formFile");
    let form = document.getElementById("profilePicForm");
    if (formFile !== null) {
        formFile.onchange = () => {
            form.submit();
        };
    }



    // Change placeholder and scrollbar in game select from bootstrap-select
    let filter_search = document.querySelectorAll(".bs-searchbox .form-control");
    if (filter_search != null){
        Array.prototype.slice.call(filter_search).forEach( (filter) => {
            filter.placeholder = "Rechercher";
        });
    }
    let search_dropdown = document.querySelector(".game-select ul.dropdown-menu.inner");
    if (search_dropdown != null){
        search_dropdown.classList.toggle("scroller");
    }



    // prevent leaving the dropdown-menu when clicking on it
    let dropdowns = document.querySelectorAll(".dropdown-menu");
    Array.prototype.slice.call(dropdowns).forEach( (form) => {
        form.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });



    // Find forms that needs validation and validate them
    // From bootstrap 5 doc https://getbootstrap.com/docs/5.0/forms/validation/#how-it-works
    let forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    });



    // cookie consent modal
    const cookieBtn = document.getElementById("cookieBtn");
    const cookieAccept = document.getElementById("acceptCookies");

    if (cookieBtn !== null){

        cookieAccept.addEventListener("click", () => {
            localStorage.setItem("CookieAccepted", "true");
        });

        setTimeout(() => {
            if (!localStorage.getItem("CookieAccepted")) {
                cookieBtn.click();
            }
        }, 1000);
    }

});