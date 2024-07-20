///////// LOCAL STORAGE //////////
// Pokud nejsou v localStorage žádné úkoly, vytvoříme pole s výchozím úkolem, jinak načteme uložené úkoly
if(localStorage.getItem("tasks") == null){
    var myToDoList = [{
        text: "Add your first task",
        completion: false
    }]
    localStorage.setItem("tasks", JSON.stringify(myToDoList))
} else {
    myToDoList = JSON.parse(localStorage.getItem("tasks"))
}

// Určení počtu nehotových úkolů
let toDoLeft = myToDoList.filter(function(oneTask){
    return oneTask.completion === false
})

// Objekt pro uchování textu z vyhledávacího políčka
const filters = {
    searchingText: ""
}

// Funkce pro filtrování a zobrazení úkolů
let renderToDos = function(ourToDos, weSearching){
    // Filtrování úkolů podle vyhledávacího textu
    let ourResults = ourToDos.filter(function(oneTask){
        return oneTask.text.toLowerCase().includes(weSearching.searchingText.toLowerCase())
    })

    // Filtrování nehotových úkolů
    let leftTasks = ourResults.filter(function(oneTask){
        return oneTask.completion === false
    })

    // Vyčištění elementu #left-tasks a zobrazení počtu nehotových úkolů
    document.querySelector("#left-tasks").innerHTML = ""
    let undoneTasks = document.createElement("p")
    undoneTasks.textContent = `Uncompleted tasks: ${leftTasks.length}`
    document.querySelector("#left-tasks").appendChild(undoneTasks)

    // Vyčištění elementu #container pro nové zobrazení úkolů
    document.querySelector("#container").innerHTML = ""

    // Vytvoření a vložení divu pro každý úkol
    ourResults.forEach(function(oneResult, index){
        let taskDiv = document.createElement("div")
        taskDiv.className = "task"

        // Vytvoření zaškrtávacího políčka pro úkol
        let input = document.createElement("input")
        input.type = "checkbox"
        input.checked = oneResult.completion
        input.addEventListener("change", function(){
            // Změna stavu úkolu (hotový/nehotový) a aktualizace localStorage
            oneResult.completion = !oneResult.completion
            localStorage.setItem("tasks", JSON.stringify(myToDoList))
            renderToDos(myToDoList, filters)
        })

        // Vytvoření popisku pro úkol
        let label = document.createElement("label")
        label.textContent = oneResult.text

        // Vytvoření ikony smazání pro úkol
        let deleteIcon = document.createElement("span")
        deleteIcon.className = "delete-icon"
        deleteIcon.textContent = "🗑️" // Emoji koše
        deleteIcon.addEventListener("click", function(){
            // Smazání úkolu z pole myToDoList a aktualizace localStorage
            myToDoList.splice(index, 1)
            localStorage.setItem("tasks", JSON.stringify(myToDoList))
            renderToDos(myToDoList, filters)
        })

        // Přidání zaškrtávacího políčka, popisku a ikony smazání do divu úkolu
        taskDiv.appendChild(input)
        taskDiv.appendChild(label)
        taskDiv.appendChild(deleteIcon)
        // Přidání divu úkolu do hlavního kontejneru
        document.querySelector("#container").appendChild(taskDiv)
    })
}

// Načítání textu z vyhledávacího políčka a volání funkce renderToDos při každé změně
let searchText = document.querySelector("#search-text")
searchText.addEventListener("input", function(event){
    filters.searchingText = event.target.value
    renderToDos(myToDoList, filters)
})

// Přidání nového úkolu
let myForm = document.querySelector("#myForm")
let count = 0

myForm.addEventListener("submit", function(event){
    // Vypnutí výchozího chování formuláře
    event.preventDefault()

    // Přidání nového úkolu do pole myToDoList a do localStorage
    let newTaskText = event.target.elements.inputTask.value
    let newTask = {
        text: newTaskText,
        completion: false
    }
    myToDoList.push(newTask)
    localStorage.setItem("tasks", JSON.stringify(myToDoList))

    // Aktualizace seznamu úkolů zobrazením nového úkolu
    renderToDos(myToDoList, filters)

    // Vymazání obsahu formuláře
    event.target.elements.inputTask.value = ""
})

// Zobrazení úkolů z localStorage při načtení stránky
renderToDos(myToDoList, filters)
