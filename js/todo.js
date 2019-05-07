var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}


var todos = document.querySelectorAll("input[type=checkbox]");

function updateTodo(id, completed) {
  // revisen si completed es booleano o string
  json_to_send = {
    "completed" : completed
  };
  json_to_send = JSON.stringify(json_to_send);
  $.ajax({
      //url: 'http://localhost:3000/todos/' + id,
      url: 'https://examen-final-lizzie-g.herokuapp.com/todos/'+id,
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'PATCH',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        console.log("UPDATE!!")
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
}


function loadTodos() {
  $.ajax({
    //url: 'http://localhost:3000/todos',
    url: 'https://examen-final-lizzie-g.herokuapp.com/todos',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      console.log(data)

      for( let i = 0; i < data.length; i++) {
        // aqui va su código para agregar los elementos de la lista
        console.log(data[i].description)
        // algo asi:
        addElementToList(data[i]._id, data[i].description, data[i].completed)
      }
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
}

loadTodos()


// o con jquery
// $('input[name=newitem]').keypress(function(event){
//     var keycode = (event.keyCode ? event.keyCode : event.which);
//     if(keycode == '13'){
//         $.ajax({})
//     }
// });

var input = document.querySelector("input[name=newitem]");

input.addEventListener('keypress', function (event) {
  if (event.charCode === 13) {
    json_to_send = {
      "description" : input.value
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
      //url: 'http://localhost:3000/todos',
      url: 'https://examen-final-lizzie-g.herokuapp.com/todos',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        console.log(data)
        addElementToList(data._id,data.description,data.checked)
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
    input.value = '';
  }
})

/*Returns number of elements in to do list*/
function countListElements()
{
  var index = document.getElementsByName('todo');
  return index.length;
}


/*When add button is clicked, reads text fields and adds it to the top of the list*/
function addElementToList(id, text, checked) {
  var newlist = document.createElement("li");
  var newinput = document.createElement("input");
   var newspan = document.createElement("span");
  newinput.id = id;
  newinput.type = "checkbox";
  newinput.name = "todo";
  newinput.value = countListElements()+1;
  if(checked){
    newinput.checked = true;
    newspan.classList.add("done");
  }
  newinput.setAttribute("onClick", "checkElement(this)");
 
  newspan.textContent = text//document.getElementById('newitem').value;

  newlist.appendChild(newinput);
  newlist.appendChild(newspan);
  var ulElement = document.getElementById("list") 
  ulElement.insertBefore(newlist, ulElement.children[0]);
  document.getElementById('newitem').value = "";
}

function checkElement(element)
{
  /* 0 if element is not checked, 1 if it is checked*/
  var bChecked = element.parentElement.getElementsByTagName("SPAN")[0].classList.length;  
  
  if (bChecked == 0)
  {
    element.parentElement.getElementsByTagName("SPAN")[0].classList.add("done")
    var copyOfelementLI= element.parentElement;
    element.parentElement.remove();
    document.getElementById("list").appendChild(copyOfelementLI);

  }
  else
  {
    element.parentElement.getElementsByTagName("SPAN")[0].classList.remove("done")
    var copyOfelementLI= element.parentElement;
    element.parentElement.remove();

    var ulElement = document.getElementById("list") 
    ulElement.insertBefore(copyOfelementLI, ulElement.children[0]);
  }
  console.log(element.id,element.checked)
  updateTodo(element.id,element.checked)
}