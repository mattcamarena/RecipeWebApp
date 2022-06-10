fetch("./recipes.json")
.then(response => {
  return response.json();
})
.then(jsondata => loadtopage(jsondata))

function loadtopage(jsn) {
  let list = document.getElementById("myList");
  if(jsn.length > 0){
    jsn.forEach((item)=>{
      let li = document.createElement("li");
      let a = document.createElement('a');
      a.innerText = item;
      a.href = "viewrecipe/" + item;
      //li.innerText = item;
      li.appendChild(a);
      list.appendChild(li);
      document.getElementById("tlholder").innerText = "";
  });
  }else{
    document.getElementById("tlholder").innerText = "No recipes found";
  }
}


function deleteRecipe() {
  console.log("deleteing recipe");
  fetch("./deleterecipe")
.then(response => {
  return response.json();
})
.then(jsondata => console.log(jsondata))
}