const taskInput=document.getElementById("taskInput");
const addTaskBtn=document.getElementById("addTaskBtn");
const taskList=document.getElementById("taskList");
const taskCounter=document.getElementById("taskCounter");
const priorityInput=document.getElementById("priorityInput");
const dueDateInput=document.getElementById("dueDateInput");
const searchInput=document.getElementById("searchInput");
const allBtn=document.getElementById("allBtn");
const completedBtn=document.getElementById("completedBtn");
const pendingBtn=document.getElementById("pendingBtn");
const clearAllBtn=document.getElementById("clearAllBtn");
const progressBar=document.getElementById("progressBar");
const progressText=document.getElementById("progressText");
const darkModeBtn=document.getElementById("darkModeBtn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
addTaskBtn.addEventListener("click",addTask);
searchInput.addEventListener("input",searchTasks);
allBtn.addEventListener("click",showAllTasks);
completedBtn.addEventListener("click",showCompletedTasks);
pendingBtn.addEventListener("click",showPendingTasks);
clearAllBtn.addEventListener("click",clearAllTasks);
darkModeBtn.addEventListener("click",function(){
    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "darkMode",
document.body.classList.contains("dark-mode")
    );
});
taskInput.addEventListener("keydown",function(event){
    if(event.key === "Enter"){
        addTask();
    }
});
for (let task of tasks){
    createTask(task);
}

updateTaskCounter();
function updateProgressBar(){
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    const percentage = total === 0?0:(completed / total)*100;
    progressBar.style.width = percentage + "%";
    progressText.textContent = `${Math.round(percentage)}% Completed`;
}
function sortTasks(){
    const priorityOrder={
        High:1,
        Medium:2,
        Low:3
    };
    tasks.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]);
    taskList.innerHTML="";

    tasks.forEach(task=>{
        createTask(task);
    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
}



function createTask(task){
    const li = document.createElement("li");

    const span = document.createElement("span");
    if(task.completed){
        span.classList.add("completed");
    }
    span.textContent = `${task.priority}-${task.text}`;
    const dateText = document.createElement("small");
    if(task.dueDate){
    dateText.textContent = `📅 Due:${task.dueDate}`;
    } else {
        dateText.textContent="";
    }
    const today=new Date().toISOString().split("T")[0];

    if(!task.completed && task.dueDate && task.dueDate<today){
        dateText.style.color="red";
        dateText.textContent+="(Overdue)";
    }
    if(task.priority === "High"){
        span.style.color="red";
    } else if(task.priority==="Medium"){
        span.style.color="orange";

    }else{
        span.style.color="green";
    }

    span.addEventListener("click",function(){
        task.completed=!task.completed;
        span.classList.toggle("completed");

        localStorage.setItem("tasks",JSON.stringify(tasks));

        updateTaskCounter();
        updateProgressBar();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️Delete";

    deleteBtn.addEventListener("click",function(){
        const index=tasks.indexOf(task);

        if(index > -1){
           tasks.splice(index,1);
        }
        localStorage.setItem("tasks",JSON.stringify(tasks));

        li.remove();
        updateTaskCounter();
        updateProgressBar();
    });
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️Edit";

    editBtn.addEventListener("click",function(){
        const newTask = prompt("Edit your task:",span.textContent);

        if (newTask!==null && newTask.trim()!==""){
            task.text = newTask;
            span.textContent = `${task.priority}-${task.text}`;
        }
    });
    const actions=document.createElement("div");
    actions.className="actions";
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);
    li.appendChild(span);
    li.appendChild(dateText);
    li.appendChild(actions);
    taskList.appendChild(li);
}
function searchTasks(){
    const searchText = searchInput.value.toLowerCase();

    const allTasks = taskList.getElementsByTagName("li");

    for (let task of allTasks){
        const taskName = task.querySelector("span").textContent.toLowerCase();

        if(taskName.includes(searchText)) {
            task.style.display = "flex";

        } else{
            task.style.display = "none";
        }
    }
}
function showAllTasks(){
    const allTasks = taskList.getElementsByTagName("li");
    for (let task of allTasks) {
        task.style.display = "flex";
    }
}
function showCompletedTasks(){
    const allTasks = taskList.getElementsByTagName("li");
    for (let task of allTasks){
        const span = task.querySelector("span");
        if (span.classList.contains("completed")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    }
}
function showPendingTasks(){
    const allTasks = taskList.getElementsByTagName("li");
    for (let task of allTasks){
        const span = task.querySelector("span");
        if (!span.classList.contains("completed")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    }
}
function clearAllTasks(){
    const confirmDelete = confirm("Are you sure you want to delete all tasks?");

    if(confirmDelete){
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
        tasks = [];
    }
}
function updateTaskCounter(){
    const allTasks = taskList.getElementsByTagName("li");
    let total = allTasks.length;
    let completed = 0;

    for (let task of allTasks){
        const span = task.querySelector("span");

        if(span.classList.contains("completed")){
            completed++;
        }
    }
    let pending = total-completed;
    taskCounter.textContent=`Total:${total}|Completed:${completed}|Pending:${pending}`;
}

function addTask(){
    const taskText=taskInput.value.trim();
    const priority=priorityInput.value;
    const dueDate=dueDateInput.value;
    if(taskText === ""){
        alert("Please enter a task!");
        return;
    }
    const task = {
        text:taskText,
        priority:priority,
        dueDate:dueDate,
        completed:false
    };
    
    tasks.push(task);
    sortTasks();

    updateTaskCounter();
    updateProgressBar();
    localStorage.setItem("tasks",JSON.stringify(tasks));
    

taskInput.value = "";

taskInput.focus();
dueDateInput.value = "";
}

if (localStorage.getItem("darkMode")==="true"){
    document.body.classList.add("dark-mode");
}