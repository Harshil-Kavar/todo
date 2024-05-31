// HTML Elements
const TodoFrom = document.getElementById("mainForm")
const mainInput = document.getElementById("mainInput")
const submitBTN = document.getElementById("submitBTN")
const todoList = document.getElementById("todo-list")
const todoCount = document.getElementById("todo-left")
const filterAllBtn = document.getElementById("filterAllBtn")
const filterUncompletedBtn = document.getElementById("filterUncompletedBtn")
const filterCompletedBtn = document.getElementById("filterCompletedBtn")
const completeAllTododiv = document.getElementById("completeAllTododiv")
const clrearCompletedTodo = document.getElementById("clrearCompletedTodo")

// Initialization
let todos = [];
let localData = [];
let editTodoIndex = null;

//Functions 
const renderTodos = (data) => {
  todoList.innerHTML = "";
  if (data.length === 0) {
    todoList.innerHTML = "<p>No Todos</p>"
  }
  data.forEach((todo, index) => {
    todoList.innerHTML += `
        <div class="list-item">
        <div class="d-flex w-80">
          <input type="checkbox" id="todo-${index}" ${todo.completed ? "checked" : ""} onclick="makeTodoComplete('${index}')">
          <p class="todo-title" onclick="editTodo('${index}')">${todo.completed ? `<del>${todo.title}</del>` : todo.title}</p>
        </div>
        <div class="show-hide-icon" onclick="deleteTodo('${index}')">
          <i class="fa-regular fa-circle-xmark"></i>
        </div>
      </div>
        `
  })
  todoCount.innerText = `${data.length}`
}

const editTodo = (index) => {
  mainInput.value = todos[index].title
  editTodoIndex = index
}
const makeTodoComplete = (index) => {
  todos[index].completed = !todos[index].completed
  backupData(todos)
  renderTodos(todos)
}
const deleteTodo = (index) => {
  todos.splice(index, 1)
  backupData(todos)
  renderTodos(todos)
}


const backupData = (data) => {
  localStorage.setItem("todos", JSON.stringify(data))
}
const loadData = () => {
  const data = localStorage.getItem("todos")
  if (data) {
    return JSON.parse(data)
  } else {
    return []
  }
}

// Event Listners

TodoFrom.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editTodoIndex != null) {
    todos[editTodoIndex].title = mainInput.value
    renderTodos(todos)
    backupData(todos)
    mainInput.value = "";
    submitBTN.classList.add("d-none")
    editTodoIndex = null;
  } else {
    const todo = {
      id: Date.now(),
      title: mainInput.value,
      completed: false
    }
    todos.push(todo)
    renderTodos(todos)
    backupData(todos)
    mainInput.value = "";
    submitBTN.classList.add("d-none")
  }
})

mainInput.addEventListener("input", (e) => {
  if (e.target.value.trim().length > 0) {
    submitBTN.disabled = false
    submitBTN.classList.remove("d-none")
  } else {
    submitBTN.disabled = true
    submitBTN.classList.add("d-none")
  }
})

filterAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderTodos(todos)
})
filterUncompletedBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const uncompletedTodos = todos.filter(todo => !todo.completed)
  renderTodos(uncompletedTodos)
})
filterCompletedBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const completedTodos = todos.filter(todo => todo.completed)
  renderTodos(completedTodos)
})

completeAllTododiv.addEventListener("click", (e) => {
  e.preventDefault();
  if (todos.length == 0) return;
  let confirm = window.confirm("Are you sure you want to complete all todos?")
  if (!confirm) return;
  todos.forEach(todo => todo.completed = true)
  renderTodos(todos)
  backupData(todos)
})

clrearCompletedTodo.addEventListener("click", (e) => {
  e.preventDefault();
  if (todos.length == 0) return;
  let confirm = window.confirm("Are you sure you want to clear completed todos?")
  if (!confirm) return;
  todos = todos.filter(todo => !todo.completed)
  renderTodos(todos)
  backupData(todos)
})


localData = loadData()
if (todos.length == 0 && localData.length > 0) {
  renderTodos(localData)
  todos = localData
} else {
  renderTodos(todos)
}