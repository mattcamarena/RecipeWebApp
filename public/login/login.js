
checkLogged()

function checkLogged(){
  
    fetch('/verifySession', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    }).then (response => response.json())
    .then(data => {
      if(data.message == "valid"){
        window.location.assign("https://recipewebapp.mattcamarena.repl.co/")
      }else{
        console.log(data)
        console.log("not valid input")
      }
  })
}


function testfetch(){
  console.log(
    fetch('/testB', {  
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      "username" : "test",
      "password" : "test"
    }),
  }).then (response => response.json())
  .then(data => {
    if(data.message == "valid"){
      document.cookie = data.token;
      console.log("?")
      console.log(data.token)
    }else{
      console.log(data)
      console.log("not valid input")
    }
    
    
  })
)
}

function login(){
  var uname = document.getElementById("name").value;
  
  var pass = document.getElementById("password").value
  console.log(uname)
  fetch('/login', {  
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      "username" : uname,
      "password" : pass
    }),
  }).then (response => response.json())
  .then(data => {
    if(data.message == "valid"){

      location.reload()
    }else{
      console.log(data)
      alert("not valid input")
     
    }
    
  })
}
