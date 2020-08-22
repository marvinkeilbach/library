let myLibrary = [];

let inputTitle;
let inputAuthor;
let inputPages;
let inputRead;

const library = document.querySelector(".library");
const books = library.childNodes;
const inputField = document.querySelector(".new-book");
const addButton = document.querySelector(".add-button");
const inputs = document.querySelectorAll(".new-book-input");
const submit = document.querySelector(".new-book-submit");

// Local Storage Check + functions
if(!(localStorage.getItem('library'))) {
    populateStorage();
} else {
    setLibrary();
}

function populateStorage() {
    window.localStorage.setItem('library', JSON.stringify(myLibrary));
}

function setLibrary() {
        let currentLibrary = JSON.parse(window.localStorage.getItem('library')) || [];
        myLibrary = currentLibrary;
        render();
}


// Event Listeners for Inputs, submit button and the add button
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        if(input.id==="add-status") {
            inputRead = input.checked;
        }
        if(input.id==="add-title") {
            inputTitle = input.value;
        }
        if(input.id==="add-author") {
            inputAuthor = input.value;
        }
        if(input.id==="add-pages") {
            inputPages = input.valueAsNumber;
        }
    });
});

submit.addEventListener("click", () => {
    if(inputTitle === "" || inputAuthor === "") {
        alert("Please enter a valid title and author of your book!");
    } else if(isNaN(inputPages) === true || inputPages >= 3000 || inputPages === 0) {
        alert("Please enter a valid page number of your book!")
        inputs.forEach(input => {
            if(input.type === "number") {
                input.value = "";
            }
        })
    } else {
        addBookToLibrary(inputTitle, inputAuthor, inputPages, inputRead);
        render();
        clearInputs();
        initializeValues();
    }
});

addButton.addEventListener("click", () => {
    inputField.classList.toggle("active");
    clearInputs();
    initializeValues();
})



// Book constructor + prototype toggle feature
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleStatus = function() {
    this.read = !this.read;
}


//Functionality (addBook, render to HTML, resetting values and Input)
function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    populateStorage();
}

function render() {
    library.innerHTML = '';

    myLibrary.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        const status = book.read ? "Read" : "Not Read Yet";
        const statusClass = book.read ? "read" : "unread";
        bookDiv.innerHTML = 
            `<button class="delete">X</button>
            <p class="book-text title">${book.title}</p>
            <p class="book-text author">${book.author}</p>
            <p class="book-text pages">${book.pages} Pages</p>
            <p class="book-text status ${statusClass}">${status}</p>
            <button class="book-text toggle">Toggle Status</button>`;
        library.appendChild(bookDiv);
    });
    updateBooks();
}

function initializeValues () {
    inputTitle = "";
    inputAuthor = "";
    inputPages = 0;
    inputRead = false;
}

function clearInputs() {
    inputs.forEach(input => {
        if(input.type === "text" || input.type === "number") {
            input.value = "";
        } else {
            input.checked = false;
        }
    });
}


// Event listeners for toggle- and delete-buttons that are updated whenever the render function is called
function updateBooks() {
    let deleteButtons = [];
    let toggleButtons = [];
    books.forEach(book => {
        deleteButtons.push(book.firstChild);
        toggleButtons.push(book.lastChild);
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            let removeIndex = deleteButtons.indexOf(button);
            myLibrary.splice(removeIndex, 1);
            populateStorage();
            render();
        })
    })
    
    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            let toggleIndex = toggleButtons.indexOf(button);
            myLibrary[toggleIndex].read = !(myLibrary[toggleIndex].read);
            populateStorage();
            render();
        });
    });
}