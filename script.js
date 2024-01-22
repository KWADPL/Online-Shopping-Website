var MainImg;
var smallimg;

document.addEventListener('DOMContentLoaded', function() {
    MainImg = document.getElementById("MainImg");
    smallimg = document.getElementsByClassName("small-img");

    if (smallimg.length > 0) {
        smallimg[0].onclick = function(){
            MainImg.src = smallimg[0].src;
        }
    }

    if (smallimg.length > 1) {
        smallimg[1].onclick = function(){
            MainImg.src = smallimg[1].src;
        }
    }

    if (smallimg.length > 2) {
        smallimg[2].onclick = function(){
            MainImg.src = smallimg[2].src;
        }
    }

    if (smallimg.length > 3) {
        smallimg[3].onclick = function(){
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

    window.onscroll = function() {
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
