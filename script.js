const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You Must Write Your TO-DO!!");
    } else {
        createTaskElement(inputBox.value);
        inputBox.value = "";
    }
}

function createTaskElement(taskText) {
    let li = document.createElement("li");
    li.innerHTML = taskText;
    li.setAttribute("draggable", true);
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    li.addEventListener("dblclick", editTask); 
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; 
    li.appendChild(span);
    
    storeData(); 
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        storeData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        storeData();
    }
}, false);

function storeData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showData() {
    listContainer.innerHTML = localStorage.getItem("data");

    let tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        task.setAttribute("draggable", true);
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragover", dragOver);
        task.addEventListener("drop", drop);
        task.addEventListener("dblclick", editTask); 
    });
}
showData();

function changeTheme() {
    const theme = document.getElementById("color-theme").value;
    document.getElementById("theme-style").href = theme;
    localStorage.setItem('selectedTheme', theme);
}

window.onload = function() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'style1.css';
    document.getElementById("theme-style").href = savedTheme;
    document.getElementById("color-theme").value = savedTheme;
    showData(); 
};

let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
    setTimeout(() => e.target.style.display = 'none', 0);
}

function dragOver(e) {
    e.preventDefault(); 
}

function drop(e) {
    e.preventDefault(); 
    if (e.target.tagName === 'LI' && draggedItem) {
        const allItems = Array.from(listContainer.children);
        const draggedIndex = allItems.indexOf(draggedItem);
        const targetIndex = allItems.indexOf(e.target);

        if (draggedIndex < targetIndex) {
            e.target.insertAdjacentElement('afterend', draggedItem);
        } else {
            e.target.insertAdjacentElement('beforebegin', draggedItem);
        }
    }
    draggedItem.style.display = 'block'; 
    draggedItem = null; 
    storeData(); 
}

function editTask(e) {
    const li = e.target;
    const originalText = li.innerText.replace("×", "").trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.className = "close-btn";

    li.innerHTML = '';
    li.appendChild(input); 
    li.appendChild(span);
    input.focus(); 

    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            li.innerHTML = input.value; 
            li.appendChild(span); 
            li.setAttribute("draggable", true); 
            li.addEventListener("dragstart", dragStart);
            li.addEventListener("dragover", dragOver);
            li.addEventListener("drop", drop);
            li.addEventListener("dblclick", editTask);
            storeData(); 
        }
    });

    input.addEventListener("blur", function () {
        li.innerHTML = originalText;
        li.appendChild(span); 
        li.setAttribute("draggable", true); 
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("drop", drop);
        li.addEventListener("dblclick", editTask); 
    });

    span.addEventListener("click", function () {
        li.remove(); 
        storeData();
    });
}
