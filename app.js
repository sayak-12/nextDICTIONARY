const sbar = document.querySelector(".search");
sbar.addEventListener("focus", ()=>{
    console.log("hi");
    document.querySelector(".placeholder").classList.add("invisible");
})
sbar.addEventListener("focusout", ()=>{
    console.log("hi");
    document.querySelector(".placeholder").classList.remove("invisible");
})

var menu = document.querySelectorAll(".menuitem");
menu.forEach((item)=>{
    item.addEventListener("click", ()=>{
        if (item.classList.contains("active")) {
            return;
        }
        else{
            menu.forEach((item)=>{
                if (item.classList.contains("active")) {
                    item.classList.remove("active");
                }
            })
            item.classList.add("active");
        }
    })
})
