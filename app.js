const sbar = document.querySelector(".search");
sbar.addEventListener("focus", () => {
  document.querySelector(".placeholder").classList.add("invisible");
});
sbar.addEventListener("focusout", () => {
  if (sbar.value === "") {
    document.querySelector(".placeholder").classList.remove("invisible");
  }
});





window.onload = () => {
  fetchWord("hello");
};




var searchbtn = document.querySelector(".searchbar i");
searchbtn.addEventListener("click", () => {
  var stext = document.querySelector(".search").value;
  fetchWord(stext);
});




function datacall(result, word) {
  console.log(result);
  if (result.title) {
    console.log("can't find " + word);
  } else {
    document.querySelector(".pos1").innerHTML = "";
    document.querySelector(".poslist").innerHTML = "";
    document.querySelector(".word").innerHTML = result[0].word;


    result[0].meanings.forEach((mean) => {
      var mn = document.createElement("div");
      mn.className = "pos";
      mn.innerText = mean.partOfSpeech;
      document.querySelector(".poslist").appendChild(mn);
    });


    document.querySelector(".poslist").firstElementChild.classList.add("active");
    var pos = document.querySelectorAll(".pos");
    document.querySelector(".posholder").innerHTML="";
    var i=0;
    pos.forEach((item) => {
        i = i+1;
        var em = document.createElement("div");
        em.className = "pos1";
        if (i==1) {
            em.classList.add("active");
        }
        em.setAttribute("data-index", i)
        item.setAttribute("data-index", i)
        document.querySelector(".posholder").appendChild(em);
      item.addEventListener("click", () => {
        if (item.classList.contains("active")) {
          return;
        } else {
          pos.forEach((item) => {
            if (item.classList.contains("active")) {
              item.classList.remove("active");
            }
          });
          item.classList.add("active");
        }
      });
      item.addEventListener("click", () => {
        var index= item.getAttribute("data-index");
        document.querySelectorAll(".pos1").forEach((item)=>{
                if (item.classList.contains("active")) {
                    item.classList.remove("active");
                } 
        })
        document.querySelector(".posholder").childNodes[index-1].classList.add("active");
      })
    });
  }
}




var menu = document.querySelectorAll(".menuitem");
menu.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("active")) {
      return;
    } else {
      menu.forEach((item) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
      });
      item.classList.add("active");
    }
  });
});





function fetchWord(word) {
  let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
  fetch(url).then((res) => res.json().then((result) => datacall(result, word)));
}


const btn =  document.querySelector(".darklight");
btn.addEventListener("click",()=>{
    document.querySelector("body").classList.toggle("light");
    document.querySelector("nav").classList.toggle("light");
    document.querySelector(".headline").classList.toggle("light");
    if (document.querySelector("body").classList.contains("light")) {
        btn.querySelector("i").setAttribute("class", "fa-solid fa-moon");
        btn.querySelector("i").style.color = "black";
    }
    else{
        btn.querySelector("i").setAttribute("class", "fa-solid fa-sun");
        btn.querySelector("i").style.color = "white";

    }

})