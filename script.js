const pre = document.querySelector(".preloader");
const preimg = document.querySelector(".preloader img");
window.onload = ()=>{
    setTimeout(()=>{
    preimg.classList.add("big");

    }, 2000);
    setTimeout(()=>{
    pre.classList.add("invisible");

    }, 2500);
}



