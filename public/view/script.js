fetch("./api/getrecipes")
.then(response => {
  return response.json();
})
.then(jsondata => loadtopage(jsondata))

checkLogged()

function loadtopage(jsn) {

  let list = document.getElementById("myList");
  
  if(jsn.length > 0){
    jsn.forEach((item)=>{
      let li = document.createElement("li");
      let a = document.createElement('a');
      a.innerText = item.name;
      a.href = "viewrecipe/" + item._id;
      //li.innerText = item;
      li.appendChild(a);
      list.appendChild(li);
      document.getElementById("tlholder").innerText = "";
  });
  }else{
    document.getElementById("tlholder").innerText = "No recipes found";
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

//COOKIES FUNCTIONS 
function loadCookies(){
  // get key
  let uKey = getCookie("userKey")
  if (uKey.length === 0){ //not logged in
    document.getElementById("edit").children[2].style.display = "none";
    document.getElementById("edit").children[3].style.display = "none";  
  }else{ //logged in 
    let uNam = getCookie("username");
    document.getElementById("edit").children[0].style.display = "none";
    document.getElementById("edit").children[1].style.display = "none";
    document.getElementById("uname").innerHTML = uNam;
  }

}

function logOut(){
  // make a call user wants to log out
  document.cookie = `uname=; expires=-99`
  document.cookie = `token=; expires=-99`

  document.getElementById("edit").children[0].style.display = "unset";
  document.getElementById("edit").children[1].style.display = "unset";
  document.getElementById("edit").children[2].style.display = "none";
  document.getElementById("edit").children[3].style.display = "none";  
  
}
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

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

function checkLogged(){
  
    fetch('/verifyCookie', {                                                                                                        
    method: 'post',
    headers: {'Content-Type': 'application/json'},
  }).then (response => response.json())
  .then(data => {
    if(data.message == "valid"){
      console.log("val")
      document.getElementById("edit").children[0].style.display = "none";
      document.getElementById("edit").children[1].style.display = "none";
      document.getElementById("edit").children[2].style.display = "unset";
      document.getElementById("edit").children[3].style.display = "unset";  
      document.getElementById("uname").innerHTML = uname;
    }else{
      console.log("notvalid")
      document.getElementById("edit").children[0].style.display = "unset";
      document.getElementById("edit").children[1].style.display = "unset";
      document.getElementById("edit").children[2].style.display = "none";
      document.getElementById("edit").children[3].style.display = "none";  
    }
    
    
  })

}