fetch("./api/getmyrecipes")
  .then(response => {
    return response.json();
  })
  .then(jsondata =>  yes(jsondata))

function yes(jsn){
  console.log("hello")
  console.log(jsn)
  var res = ""

  jsn.forEach((item)=>{   
      console.log(item.name);
      res += item.name;
  });
  
  document.getElementById("p1").innerHTML = res
    
}