

function testfetch(){
  
  console.log(
    fetch('/testB', {  
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      "username" : "matt",
      "password" : "pass"
    }),
  }).then (response => response.json())
  .then(data => console.log(data))
)
}
function login(){
  


  /*
    var data = new FormData();
  data.append("name", document.getElementById("name").value);
  data.append("password", document.getElementById("password").value);
  fetch('/login', {  
    method: 'post',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      "username" : "test",
      "password" : "test"
    }),
  })
  
  fetch("/login", {
    method: "POST",
    body: data
  })
    .then((response) => {
      console.log("?")
      response.json()})
    .then((result) => {
      console.log('suc', result);
    })
  .catch((err) => {
    console.log('err', err)
  })
  */
}
