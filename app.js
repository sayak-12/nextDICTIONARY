const sbar = document.querySelector(".search");
sbar.addEventListener("focus", () => {
  document.querySelector(".placeholder").classList.add("invisible");
});
sbar.addEventListener("focusout", () => {
  if (sbar.value === "") {
    document.querySelector(".placeholder").classList.remove("invisible");
  }
});

var bookmarkArray = [];
var HistoryArray = [];


window.onload = () => {
  fetchWord("hello");
};



var fontArray =["'Bebas Neue', cursive;","'Libre Baskerville', serif;", "'Oswald', sans-serif;" ,"'Playfair Display', serif;", "'Poppins', sans-serif;"];
var searchbtn = document.querySelector(".searchbar i");
searchbtn.addEventListener("click", () => {
  var stext = document.querySelector(".search").value;
  fetchWord(stext);
});




function datacall(result, word) {
  document.querySelector(".listen").setAttribute("data-audio-url", "");
HistoryArray.push(word);
console.log(HistoryArray);
  result[0].phonetics.forEach((phn)=>{
    if (phn.audio != "") {
      console.log(phn.audio);
      document.querySelector(".listen").setAttribute("data-audio-url", phn.audio);
    }
  })
  

  console.log(result);
  if (result.title) {
    document.querySelector(".word").innerHTML = "We're sorry, we couldn't find any reference for the word "+word+".";
    document.querySelector(".word").classList.add("inactive");
    document.querySelector(".pos1").innerHTML = "";
    document.querySelector(".poslist").innerHTML = "";

  } else {
    if (document.querySelector(".word").classList.contains("inactive")) {
      document.querySelector(".word").classList.remove("inactive");
    }
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
        em.setAttribute("data-index", i);
        em.setAttribute("partsop", item.textContent);
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
        document.querySelectorAll(".pos1").forEach((item)=>{
          if (item.classList.contains("active")) {
            var part = item.getAttribute("partsop");
            result[0].meanings.forEach((mn)=>{
              if (mn.partOfSpeech === part) {
                item.innerHTML = "";
                mn.definitions.forEach((def)=>{
                  var el = createelem("div", "meaning");
                el.innerHTML = "<i class='fa-brands fa-slack'></i>"+def.definition;
                item.appendChild(el);
                  var el1 = createelem("div", "example");
                el1.textContent = def.example;
                item.appendChild(el1);
                })
              }
            })
          }
        })
      })
    });
    document.querySelectorAll(".pos1").forEach((item)=>{
      if (item.classList.contains("active")) {
        var part = item.getAttribute("partsop");
        result[0].meanings.forEach((mn)=>{
          if (mn.partOfSpeech === part) {
            item.innerHTML = "";
            mn.definitions.forEach((def)=>{
              var el = createelem("div", "meaning");
            el.innerHTML = "<i class='fa-brands fa-slack'></i>"+def.definition;
            item.appendChild(el);
              var el1 = createelem("div", "example");
            el1.textContent = def.example;
            item.appendChild(el1);
            })
          }
        })
      }
    })
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

function  createelem(elem, cls) {
  var el= document.createElement(""+elem);
  el.className = ""+cls;
  return el;
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
var fontindex= -1;
document.querySelector(".copy").addEventListener("click", ()=>{
  navigator.clipboard.writeText(document.querySelector(".word").innerHTML);
  document.querySelector(".copy i").setAttribute("class", "fa-solid fa-check");
  setTimeout(()=>{
  document.querySelector(".copy i").setAttribute("class", "fa-regular fa-copy");

  },2000)
})
document.querySelector(".listen").addEventListener("click", ()=>{
  var audiosource = document.querySelector(".listen").getAttribute("data-audio-url");
  var a = new Audio(audiosource);
  a.play();
})
document.querySelector(".font").addEventListener("click", ()=>{
  fontindex = ((fontindex+1)%5);
  console.log(fontArray[fontindex]);
  var allElements = document.querySelectorAll('*');
  allElements.forEach(el =>{
    if (el.tagName !="I") {
    el.setAttribute("style", "font-family:"+fontArray[fontindex]);
      
    }
  })
})
document.querySelector(".bookm").addEventListener("click", ()=>{
  bookmarkArray.push(document.querySelector(".word").innerHTML)
  document.querySelector(".bookm i").setAttribute("class", "fa-solid fa-check");
  setTimeout(()=>{
  document.querySelector(".bookm i").setAttribute("class", "fa-regular fa-bookmark");

  },2000)
  console.log(bookmarkArray);
})
document.querySelectorAll(".menuitem").forEach(item=>{
  item.addEventListener("click", ()=>{
    if (document.getElementById("history").classList.contains("active")) {
      document.getElementById("histslide").classList.add("active");
    }
    else{
      document.getElementById("histslide").classList.remove("active");
    }
  })
})
document.querySelectorAll(".menuitem").forEach(item=>{
  item.addEventListener("click", ()=>{
    if (document.getElementById("bookmarks").classList.contains("active")) {
      document.getElementById("bookmslide").classList.add("active");
    }
    else{
      document.getElementById("bookmslide").classList.remove("active");
    }
  })
})