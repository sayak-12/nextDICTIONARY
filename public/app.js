import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import {
  getDatabase,
  ref as dbref,
  onValue, child,
  push,
  get, set, update
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { arr } from "./db.js";
const firebaseConfig = {
  apiKey: "AIzaSyDuinZ2LIH8eXRUFHjdfJEXzm7oVQz7Ous",
  authDomain: "nextdictionary-47e38.firebaseapp.com",
  databaseURL:
    "https://nextdictionary-47e38-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nextdictionary-47e38",
  storageBucket: "nextdictionary-47e38.appspot.com",
  messagingSenderId: "74714748153",
  appId: "1:74714748153:web:b0d3c1dfe0fe8d71a57e28",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
const db = getDatabase(app);
var usern = "";
onAuthStateChanged(auth, (user) => {
  if (!user) {
    document.querySelector(".logout").innerHTML = "Log In";
    document.querySelector(".logout").style.backgroundColor = "rgb(0, 185, 62)";
    document.querySelector(".gmail").innerHTML = "YourEmailHere@gmail.com";
    document.querySelector(".handle").innerHTML = "@guest";
    document.querySelector(".fullname").innerHTML = "Guest User";
    document.querySelector(".ph").innerHTML = "+1-0000011111";
    document.querySelector(".userpic").style.backgroundImage =
      "url(https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png)";
    document.querySelector(".account").innerHTML =
      "<i class='fa-solid fa-user'></i><b>guest</b>";
      if ((window.innerWidth)<=540) {
        document.querySelector(".account").childNodes.forEach((item)=>{
          if(item.nodeName === "B"){
            document.querySelector(".account").removeChild(item);
          };
        })
      }
  } 
  else {
    document.querySelector(".logout").innerHTML = "Log Out";
    document.querySelector(".logout").style.backgroundColor = "rgb(185, 0, 0)";
    document.querySelector(".logout").style.color = "white";

    onValue(dbref(db, "/accounts/" + user.uid + "/email"), (entry) => {
      document.querySelector(".gmail").innerHTML = entry._node.value_;
    });
    onValue(dbref(db, "accounts/" + user.uid + "/phone"), (entry) => {
      document.querySelector(".ph").innerHTML = entry._node.value_;
    });
    onValue(dbref(db, "accounts/" + user.uid + "/name"), (entry) => {
      document.querySelector(".fullname").innerHTML = entry._node.value_;
    });
    document.querySelector(".searchbar i").onclick = () => {
      if (document.querySelector(".searchbar input").value != "") {
        const arrayRef = dbref(db, "accounts/" + user.uid + "/history");
        push(arrayRef, document.querySelector(".searchbar input").value);
      }
    };
    document.querySelector(".bookm").onclick = () => {
      if (document.querySelector(".word").innerText != "") {
        const arrayRef = dbref(db, "accounts/" + user.uid + "/bookmarkedArray");
        push(arrayRef, document.querySelector(".word").innerText);
      }
    };

    getDownloadURL(ref(storage, user.email))
      .then((url) => {
        document.querySelector(".account").innerHTML =
          "<img src='" + url + "' alt=''>";
        const img = document.querySelector(".userpic");
        img.style.backgroundImage = "url(" + url + ")";
        onValue(dbref(db, "accounts/" + user.uid + "/username"), (entry) => {
          document.querySelector(".handle").innerHTML = "@" + entry._node.value_;
          document.querySelector(".account").innerHTML +=
            "<b>" + entry._node.value_ + "</b>";
            if ((window.innerWidth)<=540) {
              document.querySelector(".account").childNodes.forEach((item)=>{
                if(item.nodeName === "B"){
                  console.log(item.nodeName + " item deleted");
                  document.querySelector(".account").removeChild(item);
                };
              })
            }
        });
      })
      .catch((error) => {
        console.log(error);
      });
    
  }
});

document.querySelector(".logout").addEventListener("click", () => {
  if (document.querySelector(".logout").innerHTML === "Log In") {
    location.replace("login.html");
  } else {
    signOut(auth)
      .then(() => {
        alert("succesfully signed out!");
      })
      .catch((error) => {
        alert(error);
      });
  }
});

//modular code initialisation done

//test comment
window.addEventListener("load", ()=>{
  if ((window.innerWidth)<=540) {
    document.querySelectorAll(".menuitem").forEach((item)=>{
      const childnod = item.childNodes;
      childnod.forEach((chnod)=>{
        if (chnod.nodeType === 3) {
          chnod.nodeValue = "";

        }
      })
    })
    
  }
})
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

var fontArray = [
  "'Bebas Neue', cursive;",
  "'Libre Baskerville', serif;",
  "'Oswald', sans-serif;",
  "'Playfair Display', serif;",
  "'Poppins', sans-serif;",
];
var searchbtn = document.querySelector(".searchbar i");
searchbtn.addEventListener("click", () => {
  var stext = document.querySelector(".search").value;
  fetchWord(stext);
});

document.querySelector(".account").addEventListener("click", () => {
  document.querySelector(".accdetails").classList.toggle("active");
});

function datacall(result, word) {
  document.querySelector(".listen").setAttribute("data-audio-url", "");
  HistoryArray.push(word);
  if (!result.title) {
    ("");
    result[0].phonetics.forEach((phn) => {
      if (phn.audio != "") {
        document
          .querySelector(".listen")
          .setAttribute("data-audio-url", phn.audio);
      }
    });
  }

  if (result.title) {
    document.querySelector(".word").innerHTML =
      "We're sorry, we couldn't find any reference for the word " + word + ".";
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

    document
      .querySelector(".poslist")
      .firstElementChild.classList.add("active");
    var pos = document.querySelectorAll(".pos");
    document.querySelector(".posholder").innerHTML = "";
    var i = 0;
    pos.forEach((item) => {
      i = i + 1;
      var em = document.createElement("div");
      em.className = "pos1";
      if (i == 1) {
        em.classList.add("active");
      }
      em.setAttribute("data-index", i);
      em.setAttribute("partsop", item.textContent);
      item.setAttribute("data-index", i);
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
        var index = item.getAttribute("data-index");
        document.querySelectorAll(".pos1").forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.remove("active");
          }
        });
        document
          .querySelector(".posholder")
          .childNodes[index - 1].classList.add("active");
        document.querySelectorAll(".pos1").forEach((item) => {
          if (item.classList.contains("active")) {
            var part = item.getAttribute("partsop");
            result[0].meanings.forEach((mn) => {
              if (mn.partOfSpeech === part) {
                item.innerHTML = "";
                mn.definitions.forEach((def) => {
                  var el = createelem("div", "meaning");
                  el.innerHTML =
                    "<i class='fa-brands fa-slack'></i>" + def.definition;
                  item.appendChild(el);
                  var el1 = createelem("div", "example");
                  el1.textContent = def.example;
                  item.appendChild(el1);
                });
              }
            });
          }
          result[0].meanings.forEach((mn) => {
            if (mn.partOfSpeech === item.getAttribute("partsop")) {
              var syn = createelem("div", "syn");
              syn.innerHTML = "<h1>Synonyms</h1>";

              item.appendChild(syn);
              var syn2 = createelem("div", "syn2");

              item.appendChild(syn2);
              if (mn.synonyms.length == 0) {
                var ss = createelem("div", "synitem-inactive");
                ss.innerHTML = "No synonyms";
                syn2.appendChild(ss);
              }
              mn.synonyms.forEach((syn1) => {
                var ss = createelem("div", "synitem");
                ss.innerHTML = syn1;
                syn2.appendChild(ss);
              });
            }
          });
          result[0].meanings.forEach((mn) => {
            if (mn.partOfSpeech === item.getAttribute("partsop")) {
              var syn = createelem("div", "syn");
              syn.innerHTML = "<h1>Antonyms</h1>";

              item.appendChild(syn);
              var syn2 = createelem("div", "syn2");

              item.appendChild(syn2);
              if (mn.antonyms.length == 0) {
                var ss = createelem("div", "synitem-inactive");
                ss.innerHTML = "No antonyms";
                syn2.appendChild(ss);
              }
              mn.antonyms.forEach((syn1) => {
                var ss = createelem("div", "synitem");
                ss.innerHTML = syn1;
                syn2.appendChild(ss);
              });
            }
          });
        });
      });
    });
    document.querySelectorAll(".pos1").forEach((item) => {
      if (item.classList.contains("active")) {
        var part = item.getAttribute("partsop");
        result[0].meanings.forEach((mn) => {
          if (mn.partOfSpeech === part) {
            item.innerHTML = "";
            mn.definitions.forEach((def) => {
              var el = createelem("div", "meaning");
              el.innerHTML =
                "<i class='fa-brands fa-slack'></i>" + def.definition;
              item.appendChild(el);
              var el1 = createelem("div", "example");
              el1.textContent = def.example;
              item.appendChild(el1);
            });
          }
        });
      }
      result[0].meanings.forEach((mn) => {
        if (mn.partOfSpeech === item.getAttribute("partsop")) {
          var syn = createelem("div", "syn");
          syn.innerHTML = "<h1>Synonyms</h1>";
          item.appendChild(syn);
          var syn2 = createelem("div", "syn2");

          item.appendChild(syn2);
          if (mn.synonyms.length == 0) {
            var ss = createelem("div", "synitem-inactive");
            ss.innerHTML = "No synonyms";
            syn2.appendChild(ss);
          }
          mn.synonyms.forEach((syn1) => {
            var ss = createelem("div", "synitem");
            ss.innerHTML = syn1;
            syn2.appendChild(ss);
          });
        }
      });
      result[0].meanings.forEach((mn) => {
        if (mn.partOfSpeech === item.getAttribute("partsop")) {
          var syn = createelem("div", "syn");
          syn.innerHTML = "<h1>Antonyms</h1>";

          item.appendChild(syn);
          var syn2 = createelem("div", "syn2");

          item.appendChild(syn2);
          if (mn.antonyms.length == 0) {
            var ss = createelem("div", "synitem-inactive");
            ss.innerHTML = "No antonyms";
            syn2.appendChild(ss);
          }
          mn.antonyms.forEach((syn1) => {
            var ss = createelem("div", "synitem");
            ss.innerHTML = syn1;
            syn2.appendChild(ss);
          });
        }
      });
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
function fetchWordRandom() {
  fetchWord(arr[Math.floor(Math.random()*arr.length)]);
}

function createelem(elem, cls) {
  var el = document.createElement("" + elem);
  el.className = "" + cls;
  return el;
}

const btn = document.querySelector(".darklight");
btn.addEventListener("click", () => {
  document.querySelector("body").classList.toggle("light");
  document.querySelector("nav").classList.toggle("light");
  document.querySelector(".menu").classList.toggle("light");
  document.querySelector(".headline").classList.toggle("light");
  if (document.querySelector("body").classList.contains("light")) {
    btn.querySelector("i").setAttribute("class", "fa-solid fa-moon");
    btn.querySelector("i").style.color = "black";
  } else {
    btn.querySelector("i").setAttribute("class", "fa-solid fa-sun");
    btn.querySelector("i").style.color = "white";
  }
});
var fontindex = -1;
document.querySelector(".copy").addEventListener("click", () => {
  navigator.clipboard.writeText(document.querySelector(".word").innerHTML);
  document.querySelector(".copy i").setAttribute("class", "fa-solid fa-check");
  setTimeout(() => {
    document
      .querySelector(".copy i")
      .setAttribute("class", "fa-regular fa-copy");
  }, 2000);
});
document.querySelector(".listen").addEventListener("click", () => {
  var audiosource = document
    .querySelector(".listen")
    .getAttribute("data-audio-url");
  var a = new Audio(audiosource);
  a.play();
});
document.querySelector(".font").addEventListener("click", () => {
  fontindex = (fontindex + 1) % 5;
  var allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    if (el.tagName != "I") {
      el.setAttribute("style", "font-family:" + fontArray[fontindex]);
    }
  });
});
document.querySelector(".bookm").addEventListener("click", () => {
  bookmarkArray.push(document.querySelector(".word").innerHTML);
  document.querySelector(".bookm i").setAttribute("class", "fa-solid fa-check");
  setTimeout(() => {
    document
      .querySelector(".bookm i")
      .setAttribute("class", "fa-regular fa-bookmark");
  }, 2000);
});
document.querySelectorAll(".menuitem").forEach((item) => {
  item.addEventListener("click", () => {
    if (document.getElementById("history").classList.contains("active")) {
      document.getElementById("histslide").classList.add("active");
      if (!document.querySelector(".scrollable").classList.contains("invisible")) {
      document.querySelector(".scrollable").classList.add("invisible");  
      }
      document.getElementById("histslide").innerHTML =
        "<div id='hwrapper'><h1>Search History</h1></div>";
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          HistoryArray.forEach((hist) => {
            var idh = document.createElement("i");
            var idh2 = document.createElement("i");
            var x = document.createElement("div");
            x.className = "historylistitem";
            x.textContent = hist;
            idh.className = "fa-regular fa-copy";
            idh2.className = "fa-solid fa-trash";

            idh.setAttribute("title", "copy");
            idh2.setAttribute("title", "delete");

            x.setAttribute("title", "Search for : " + hist);
            document.getElementById("hwrapper").appendChild(x);
            x.appendChild(idh);
            x.appendChild(idh2);

            idh.addEventListener("click", () => {
              navigator.clipboard.writeText(x.textContent);
              idh.setAttribute("class", "fa-solid fa-check");
              setTimeout(() => {
                idh.setAttribute("class", "fa-regular fa-copy");
              }, 700);
            });
            idh2.addEventListener("click", ()=>{
              x.style.opacity ="0";
              setTimeout(()=>{
              x.style.display ="none";

              }, 500)
            })
          });
        } else {
          const arrayRef = dbref(db, "accounts/" + user.uid + "/history");
          get(arrayRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const arrayData1 = snapshot.val();
                const arrayData = Object.values(arrayData1);
                arrayData.forEach((hist) => {
                  var idh = document.createElement("i");
                  var idh2 = document.createElement("i");
                  var x = document.createElement("div");
                  x.className = "historylistitem";
                  x.textContent = hist;
                  idh.className = "fa-regular fa-copy";
            idh2.className = "fa-solid fa-trash";

                  idh.setAttribute("title", "copy");
            idh2.setAttribute("title", "delete");

                  x.setAttribute("title", "Search for : " + hist);
                  document.getElementById("hwrapper").appendChild(x);
                  x.appendChild(idh);
                  x.appendChild(idh2);

                  idh.addEventListener("click", () => {
                    navigator.clipboard.writeText(x.textContent);
                    idh.setAttribute("class", "fa-solid fa-check");
                    setTimeout(() => {
                      idh.setAttribute("class", "fa-regular fa-copy");
                    }, 700);
                  });
                  idh2.addEventListener("click", ()=>{
                    x.style.opacity ="0";
                    setTimeout(()=>{
                    x.style.display ="none";
                    }, 500)
                    const indexToDelete = arrayData.indexOf(x.textContent);
                    if (indexToDelete !== -1) {
                      arrayData.splice(indexToDelete, 1);
                    }
                    const obj = arrayData.reduce((acc, value, index) => {
                      acc[index] = value;
                      return acc;
                    }, {});
                    set(arrayRef,obj);
                  })
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      document.getElementById("histslide").classList.remove("active");
      if (document.querySelector(".scrollable").classList.contains("invisible")) {
        document.querySelector(".scrollable").classList.remove("invisible");  
        }

    }
  });
});
document.querySelectorAll(".menuitem").forEach((item) => {
  item.addEventListener("click", () => {
    if (document.getElementById("bookmarks").classList.contains("active")) {
      document.getElementById("bookmslide").classList.add("active");
      if (!document.querySelector(".scrollable").classList.contains("invisible")) {
        document.querySelector(".scrollable").classList.add("invisible");  
        }
      document.getElementById("bookmslide").innerHTML =
        "<div id='bwrapper'><h1>Bookmarked Words</h1></div>";

      onAuthStateChanged(auth, (user) => {
        if (!user) {
          bookmarkArray.forEach((hist) => {
            var idh = document.createElement("i");
            var idh2 = document.createElement("i");
            var x = document.createElement("div");
            x.className = "historylistitem";
            x.textContent = hist;
            idh.className = "fa-regular fa-copy";
            idh2.className = "fa-solid fa-trash";
            idh.setAttribute("title", "copy");
            idh2.setAttribute("title", "delete");
            x.setAttribute("title", "Search for : " + hist);
            document.getElementById("hwrapper").appendChild(x);
            x.appendChild(idh);
            x.appendChild(idh2);
            idh.addEventListener("click", () => {
              navigator.clipboard.writeText(x.textContent);
              idh.setAttribute("class", "fa-solid fa-check");
              setTimeout(() => {
                idh.setAttribute("class", "fa-regular fa-copy");
              }, 700);
            });
            idh2.addEventListener("click", ()=>{
              x.style.opacity ="0";
              setTimeout(()=>{
              x.style.display ="none";
              }, 500)

            })
          });
        } else {
          const arrayRef = dbref(
            db,
            "accounts/" + user.uid + "/bookmarkedArray"
          );
          get(arrayRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const arrayData1 = snapshot.val();
                const arrayData = Object.values(arrayData1);
                arrayData.forEach((hist) => {
                  var idh = document.createElement("i");
                  var idh2 = document.createElement("i");
                  var x = document.createElement("div");
                  x.className = "historylistitem";
                  x.textContent = hist;
                  idh.className = "fa-regular fa-copy";
                  idh2.className = "fa-solid fa-trash";
                  idh.setAttribute("title", "copy");
                  idh2.setAttribute("title", "delete")
                  x.setAttribute("title", "Search for : " + hist);
                  document.getElementById("bwrapper").appendChild(x);
                  x.appendChild(idh);
                  x.appendChild(idh2);
                  idh.addEventListener("click", () => {
                    navigator.clipboard.writeText(x.textContent);
                    idh.setAttribute("class", "fa-solid fa-check");
                    setTimeout(() => {
                      idh.setAttribute("class", "fa-regular fa-copy");
                    }, 700);
                  });
                  idh2.addEventListener("click", ()=>{
                    x.style.opacity ="0";

                    setTimeout(()=>{
                    x.style.display ="none";
                    }, 500)
                    const indexToDelete = arrayData.indexOf(x.textContent);
                    if (indexToDelete !== -1) {
                      arrayData.splice(indexToDelete, 1);
                    }
                    const obj = arrayData.reduce((acc, value, index) => {
                      acc[index] = value;
                      return acc;
                    }, {});
                    set(arrayRef,obj);
                  })
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      document.getElementById("bookmslide").classList.remove("active");
      
    }
  });
});
var word = "";
document.querySelector(".search").addEventListener("input", (e)=>{
  const query = e.target.value.toLowerCase();
  const matchingWords = arr.filter((word) => {
    return word.toLowerCase().startsWith(query);
  });
  var cont =document.querySelector('.autocont');
  cont.innerHTML='';
  if (matchingWords.length!=0) {
    if (!document.querySelector(".autocont").classList.contains("active")) {
      document.querySelector(".autocont").classList.add("active");
    }
    if (matchingWords.length >= 4) {
      for (let index = 0; index < 4; index++) {
        var x = document.createElement("div");
        x.className = "autoc";
        x.id = "auto" + index;
        x.innerHTML = `<p>${matchingWords[index]}</p><i class='fa-solid fa-magnifying-glass'></i>`;
        cont.appendChild(x);
      }
      var y = document.createElement("div");
        y.className = "autocnf";
        y.id = "auto";
        y.innerHTML = `<p>Search for : ${query}</p><i class='fa-solid fa-magnifying-glass'></i>`;
        cont.appendChild(y);
    }
    else{
      for (let index = 0; index < matchingWords.length; index++) {
        var x = document.createElement("div");
        x.className = "autoc";
        x.id = "auto" + index;
        x.innerHTML = `<p>${matchingWords[index]}</p><i class='fa-solid fa-magnifying-glass'></i>`;
        cont.appendChild(x);
      }
      var y = document.createElement("div");
        y.className = "autocnf";
        y.id = "auto";
        y.innerHTML = `<p>Search for : ${query}</p><i class='fa-solid fa-magnifying-glass'></i>`;
        cont.appendChild(y);
    }
    document.querySelectorAll(".autoc").forEach((item)=>{
      item.addEventListener("click", ()=>{
        fetchWord(item.querySelector("p").innerText)
        if (document.querySelector(".autocont").classList.contains("active")) {
          document.querySelector(".autocont").classList.remove("active");
        }
      })
    })
  }
  else{
    var y = document.createElement("div");
        y.className = "autocnf";
        y.id = "auto";
        y.innerHTML = `<p>Search for : ${query}</p><i class='fa-solid fa-magnifying-glass'></i>`;
        cont.appendChild(y);
        y.addEventListener("click", ()=>{
          fetchWord(query)
        if (document.querySelector(".autocont").classList.contains("active")) {
          document.querySelector(".autocont").classList.remove("active");
        }
        })
  }
  
})



document.querySelector(".search").addEventListener("focusout",()=>{
  if (sbar.value==="") {
    if (document.querySelector(".autocont").classList.contains("active")) {
    document.querySelector(".autocont").classList.remove("active");
  }
  }
  
})
document.querySelectorAll(".menuitem").forEach((item) => {
  item.addEventListener("click", () => {
    if (document.getElementById("trending").classList.contains("active")) {
      document.getElementById("wordslide").classList.add("active");
      console.clear();
      document.getElementById("wordslide").innerHTML =
        "";
        fetchWordRandom();
    } else {
      document.getElementById("wordslide").classList.remove("active");
      
    }
  });
});
