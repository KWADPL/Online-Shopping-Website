var MainImg;
var smallimg;

document.addEventListener('DOMContentLoaded', function () {
    MainImg = document.getElementById("MainImg");
    smallimg = document.getElementsByClassName("small-img");

    if (smallimg.length > 0) {
        smallimg[0].onclick = function () {
            MainImg.src = smallimg[0].src;
        }
    }

    if (smallimg.length > 1) {
        smallimg[1].onclick = function () {
            MainImg.src = smallimg[1].src;
        }
    }

    if (smallimg.length > 2) {
        smallimg[2].onclick = function () {
            MainImg.src = smallimg[2].src;
        }
    }

    if (smallimg.length > 3) {
        smallimg[3].onclick = function () {
            MainImg.src = smallimg[3].src;
        }
    }

    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }

    let prevScrollPos = window.pageYOffset;

    window.onscroll = function () {
        let currentScrollPos = window.pageYOffset;
        let header = document.getElementById("header");
        let navbar = document.getElementById("navbar");

        if (prevScrollPos > currentScrollPos) {
            header.style.opacity = "1";
            navbar.style.opacity = "1";
        } else {
            header.style.opacity = "0";
            navbar.style.opacity = "0";
        }

        prevScrollPos = currentScrollPos;
    };
});

function handleFormSubmit(event, formId) {
    var form = document.getElementById(formId);

    if (!form) {
        console.error('Form not found:', formId);
        return;
    }

    var response = grecaptcha.getResponse();

    if (response.length === 0) {
        alert("Please verify yourself using reCAPTCHA!");
        event.preventDefault();
        return;
    }

    var name = form.querySelector('[name="name"]').value;
    var surname = form.querySelector('[name="surname"]').value;
    var email = form.querySelector('[name="email"]').value;
    var department = form.querySelector('[name="department"]').value;
    var message = form.querySelector('[name="message"]').value;
    var username = form.querySelector('[name="username"]').value;
    var password = form.querySelector('[name="password"]').value;

    if (formId === 'myForm' && (!name || !surname || !email || !department || !message)) {
        alert("You did something wrong. Fill all fields correctly and verify yourself!");
        event.preventDefault();
    } else if (formId === 'signform' && (!username || !password || !email)) {
        alert("You did something wrong. Fill all fields correctly and verify yourself!");
        event.preventDefault();
    } else if (formId === 'login' && (!username || !password)) {
        alert("You did something wrong. Fill all fields correctly and verify yourself!");
        event.preventDefault();
    } else {
        var formData = new FormData(form);

        fetch('https://formspree.io/f/mjvnykjl', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var myForm = document.getElementById('myForm');
    var signForm = document.getElementById('signform');
    var loginForm = document.getElementById('login');

    if (myForm) {
        myForm.addEventListener('submit', function (event) {
            handleFormSubmit(event, 'myForm');
        });
    } else {
        console.error('myForm not found.');
    }

    if (signForm) {
        signForm.addEventListener('submit', function (event) {
            handleFormSubmit(event, 'signform');
        });
    } else {
        console.error('signform not found.');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            handleFormSubmit(event, 'login');
        });
    } else {
        console.error('login not found.');
    }
});

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


function toggleForm() {
    $("#contactFormContainer").slideToggle(function () {
        var formState = $(this).is(":visible") ? "open" : "closed";
        sessionStorage.setItem("formState", formState);
    });
}


function closeForm() {
    $("#contactFormContainer").slideUp(function () {
        sessionStorage.setItem("formState", "closed");
    });
}


if (isMobile()) {
    $("#contactIcon button").click(toggleForm);
} else {

    $(".close.mobile-only").hide();
}


var formState = sessionStorage.getItem("formState");


if (formState === "open") {
    $("#contactFormContainer").show();
} else {
    $("#contactFormContainer").hide();
}