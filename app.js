const libraryContainer = document.querySelector(".library");
const books = libraryContainer.childNodes;
const inputField = document.querySelector(".new-book");
const addButton = document.querySelector(".add-button");
const inputs = document.querySelectorAll(".new-book-input");
const submit = document.querySelector(".new-book-submit");

const error = document.querySelectorAll(".message");
const title = document.querySelector("#add-title");
const author = document.querySelector("#add-author");
const pages = document.querySelector("#add-pages");
const status = document.querySelector("add-status");

const library = (function () {
  let myLibrary = JSON.parse(localStorage.getItem("library")) || [];
  let inputTitle;
  let inputAuthor;
  let inputPages;
  let inputRead;

  // Book class with toggleStatus prototype method
  class Book {
    constructor(title, author, pages, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.read = read;
    }
    toggleStatus() {
      this.read = !this.read;
    }
  }

  function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    populateStorage();
  }

  function populateStorage() {
    localStorage.setItem("library", JSON.stringify(myLibrary));
  }

  function initializeValues() {
    inputTitle = "";
    inputAuthor = "";
    inputPages = 0;
    inputRead = false;
  }
  // Event listeners for toggle- and delete-buttons that are updated whenever the render function is called
  function updateBooks() {
    let deleteButtons = [];
    let toggleButtons = [];
    books.forEach((book) => {
      deleteButtons.push(book.firstChild);
      toggleButtons.push(book.lastChild);
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        let removeIndex = deleteButtons.indexOf(button);
        myLibrary.splice(removeIndex, 1);
        populateStorage();
        DOM.render();
      });
    });

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        let toggleIndex = toggleButtons.indexOf(button);
        myLibrary[toggleIndex].read = !myLibrary[toggleIndex].read;
        populateStorage();
        DOM.render();
      });
    });
  }

  function getLibrary() {
    return myLibrary;
  }

  return {
    addBookToLibrary,
    populateStorage,
    updateBooks,
    initializeValues,
    getLibrary,
    inputTitle,
    inputAuthor,
    inputPages,
    inputRead,
  };
})();

const DOM = (function () {
  function render() {
    libraryContainer.innerHTML = "";

    library.getLibrary().forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.classList.add("book");
      const status = book.read ? "Read" : "Not Read Yet";
      const statusClass = book.read ? "read" : "unread";
      bookDiv.innerHTML = `<button class="delete">X</button>
                <p class="book-text title">${book.title}</p>
                <p class="book-text author">${book.author}</p>
                <p class="book-text pages">${book.pages} Pages</p>
                <p class="book-text status ${statusClass}">${status}</p>
                <button class="book-text toggle">Toggle Status</button>`;
      libraryContainer.appendChild(bookDiv);
    });
    library.updateBooks();
  }

  function clearInputs() {
    inputs.forEach((input) => {
      if (input.type === "text" || input.type === "number") {
        input.value = "";
      } else {
        input.checked = false;
      }
    });
  }

  function showError() {
    inputs.forEach((input) => {
      const message = input.nextElementSibling;
      console.dir(input);
      if (input.validity.valid) {
        message.classList = "message";
        message.innerText = "";
      } else if (input.validity.valueMissing) {
        message.innerText = "Please fill out this field";
        message.classList = "message error";
      } else if (input.validity.rangeUnderflow) {
        message.innerText = "No book is that short!";
        message.classList = "message error";
      } else if (input.validity.rangeOverflow) {
        message.innerText = "No book is that long!";
        message.classList = "message error";
      } else if (input.validity.tooShort) {
        message.innerText = "Please enter a long enough name!";
        message.classList = "message error";
      } else if (input.validity.tooLong) {
        message.innerText = "That's a bit much, eh?";
        message.classList = "message error";
      }
    });
  }

  return { render, clearInputs, showError };
})();

// Event Listeners for Inputs, submit button and the add button
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.id === "add-status") {
      library.inputRead = input.checked;
    }
    if (input.id === "add-title") {
      library.inputTitle = input.value;
    }
    if (input.id === "add-author") {
      library.inputAuthor = input.value;
    }
    if (input.id === "add-pages") {
      library.inputPages = input.valueAsNumber;
    }
  });
});

submit.addEventListener("click", () => {
  if (
    !title.validity.valid ||
    !author.validity.valid ||
    !pages.validity.valid
  ) {
    DOM.showError();
  } else {
    error.forEach((message) => {
      message.textContent = "";
      message.classList.remove("error");
    });
    library.addBookToLibrary(
      library.inputTitle,
      library.inputAuthor,
      library.inputPages,
      library.inputRead
    );
    DOM.render();
    DOM.clearInputs();
    library.initializeValues();
  }
});

addButton.addEventListener("click", () => {
  inputField.classList.toggle("active");
  DOM.clearInputs();
  library.initializeValues();
});

DOM.render();
