let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

let savedTasks = JSON.parse(localStorage.getItem("toDoList"));
if(savedTasks?.length >0){
  console.log(savedTasks);
  savedTasks.forEach(function(task) {
    addTask(task.text, task.completed);
  });
}
else{
  console.log("no task found");
}


let fetchedTasks = []; 
let currentPage = 1;
const itemsPerPage = 10;

fetch("https://jsonplaceholder.typicode.com/todos")
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    fetchedTasks = data;
    displayPage(currentPage);
  })
  .catch(function(error){
    console.log("error: ", error);
  });

  
  function displayPage(page) {
  taskList.innerHTML = ""; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsShow = fetchedTasks.slice(startIndex, endIndex);
  itemsShow.forEach(function(todo) {
    addTask(todo.title, todo.completed);
  });

  document.getElementById("page-number").textContent = 'Page ' + page ;
}

function nextPage() {
  const totalPages = Math.ceil(fetchedTasks.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayPage(currentPage);
  }
}

addBtn.addEventListener("click", function () {
  const taskText = taskInput.value;
  if (taskText !== "") {
    addTask(taskText, false);
    saveTask();
    taskInput.value = "";
  }
  else{
    console.log("no task found");
  }
});

function addTask(taskText, isCompleted){
  let li = document.createElement("li");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;

  let span = document.createElement("span");
  span.textContent = taskText;
  span.className = "task-text";
  if(isCompleted){
    span.classList.add("completed");
  }
  checkbox.addEventListener("change", function () {
    span.classList.toggle("completed");
    saveTask();
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "DELETE";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", function () {
    taskList.removeChild(li);
    saveTask();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);

}

function saveTask(){
  let tasks =[];
  let listItems = document.querySelectorAll("#taskList li");
  listItems.forEach(function(li){
    let text = li.querySelector(".task-text").textContent;
    let completed = li.querySelector("input[type='checkbox']").checked;
    tasks.push({text: text, completed: completed});
  });
  localStorage.setItem("toDoList", JSON.stringify(tasks));
}




