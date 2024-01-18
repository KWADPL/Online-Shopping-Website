const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
    })
}

if(close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active')
    })
}
var MainImg = document.getElementById("MainImg")
var smallimg = document.getElementsByClassName("small-img")

smallimg[0].onclick = function(){
    MainImg.src = smallimg[0].src;
}
smallimg[1].onclick = function(){
    MainImg.src = smallimg[1].src;
}
smallimg[2].onclick = function(){
    MainImg.src = smallimg[2].src;
}
smallimg[3].onclick = function(){
    MainImg.src = smallimg[3].src;
}
function rateProduct(selectedStars, groupId) {
    const stars = document.querySelectorAll(`#${groupId} i`);

    for (let i = 0; i < stars.length; i++) {
        if (i < selectedStars) {
            stars[i].style.color = 'gold';
        } else {
            stars[i].style.color = 'black';
        }
    }
}

