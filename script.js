//Select Elements
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");

// Vars
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// 1st render
renderToDos()

//Form Submit
form.addEventListener("submit", function (event) {
  event.preventDefault();

  saveToDo();
  renderToDos();
  localStorage.setItem('todos', JSON.stringify(todos))
});

// Save ToDo
function saveToDo() {
  const todoValue = todoInput.value;

  // Check if the todo is empty
  const isEmpty = todoValue === "";

  // check for duplicate todos
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );

  if (isEmpty) {
    showNotification("ToDo's input is empty");
  } else if (isDuplicate) {
    showNotification("Todo already exists");
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = "";
  }
}

// Render Todos
function renderToDos() {
    if(todos.length === 0){
        todosListEl.innerHTML = '<center> Nothing To Do</center>'
        return;
    }
  // Clear Element Before a re-render
  todosListEl.innerHTML = "";
  // Render Todos
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
        <div class="todo" id= ${index}>
                <i
                class="bi ${
                  todo.checked ? "bi-check-circle-fill" : "bi-circle"
                } "
                style ="color : ${todo.color}"
                data-action="check"
                ></i>
                <p class="${
                    todo.checked ? "checked" : ""
                  }" data-action="check">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash" data-action="delete"></i>

            </div>
              
        `;
  });
}

//Click Event Listener For All The Todos
todosListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  // ToDo İD
  const todo = parentElement;
  const todoId = Number(todo.id);

  //target action
  const action = target.dataset.action;

  action === "check" && checkToDo(todoId);
  action === "edit" && editToDo(todoId);
  action === "delete" && deleteToDo(todoId);
});

// Check To do

function checkToDo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderToDos();
  localStorage.setItem('todos', JSON.stringify(todos))
}

// Edit To Do

function editToDo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// Delete To Do
function deleteToDo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  //re-render
  renderToDos();
  localStorage.setItem('todos', JSON.stringify(todos))
}

// Show a notification

function showNotification(msg) {
  //change the message
  notificationEl.innerHTML = msg;

  // notification enter
  notificationEl.classList.add("notif-enter");

  // notification leave
  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
}
