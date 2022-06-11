fetch("./api/getrecipes")
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



