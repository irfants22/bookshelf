const books = [];
const RENDER_DATA = "render-books";
const SAVED_DATA = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Local storage is not supported in your browser");
    return false;
  }
  return true;
}

function saveData() {
  if (checkStorage()) {
    const parseData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parseData);
    document.dispatchEvent(new Event(SAVED_DATA));
  }
}

function loadData() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (const items of data) {
      books.push(items);
    }
  }
  document.dispatchEvent(new Event(RENDER_DATA));
}

function generateId() {
  return +new Date();
}

function generateBookInformation(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItems of books) {
    if (bookItems.id === bookId) {
      return bookItems;
    }
  }
  return null;
}

function findIndex(booksId) {
  for (const index in books) {
    if (books[index].id === booksId) {
      return index;
    }
  }
  return -1;
}

function completeBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_DATA));
  saveData();
}

function uncompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_DATA));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_DATA));
  saveData();
}

function addBook() {
  const generateID = generateId();
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookCheck = document.getElementById("inputBookIsComplete").checked;

  const bookInformation = generateBookInformation(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookCheck
  );
  books.push(bookInformation);

  document.dispatchEvent(new Event(RENDER_DATA));
  saveData();
}

function createListBooks(bookInformation) {
  const createTitle = document.createElement("h3");
  createTitle.innerText = bookInformation.title;

  const createAuthor = document.createElement("p");
  createAuthor.innerText = bookInformation.author;

  const createYear = document.createElement("p");
  createYear.innerText = bookInformation.year;

  const createContainer = document.createElement("article");
  createContainer.classList.add("book_item");
  createContainer.append(createTitle, createAuthor, createYear);
  createContainer.setAttribute("id", `book-${bookInformation.id}`);

  if (bookInformation.isComplete) {
    const uncompleteButton = document.createElement("button");
    uncompleteButton.classList.add("green");
    uncompleteButton.innerText = "Read again";

    uncompleteButton.addEventListener("click", function () {
      uncompleteBook(bookInformation.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      const confirmToDelete = confirm(
        "Are you sure you want to delete this book?"
      );

      if (confirmToDelete) {
        deleteBook(bookInformation.id);
        console.log("Deleted successfully");
      } else {
        console.log("Cancel to delete");
        return;
      }
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(uncompleteButton, deleteButton);

    createContainer.append(buttonContainer);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Already read";

    completeButton.addEventListener("click", function () {
      completeBook(bookInformation.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      const confirmToDelete = confirm("Are you sure to delete this book?");

      if (confirmToDelete) {
        deleteBook(bookInformation.id);
        console.log("Deleted successfully");
      } else {
        console.log("Cancel to delete");
        return;
      }
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(completeButton, deleteButton);

    createContainer.append(buttonContainer);
  }
  return createContainer;
}

document.addEventListener(SAVED_DATA, function () {
  console.log("The data has been saved on your local storage");
});

function searchBookByTitle() {
  const searchInput = document.getElementById("searchBookTitle");
  const searchTarget = searchInput.value.toLowerCase();

  const target = document.querySelectorAll(".book_item h3");
  const shelf = Array.from(target);

  shelf.forEach((book) => {
    const eachTitle = book.innerText;
    const hide = book.parentElement;
    if (eachTitle.toLowerCase().indexOf(searchTarget) != -1) {
      book.style.display = "block";
      hide.style.display = "block";
    } else {
      hide.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchBook = document.getElementById("searchBook");
  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBookByTitle();
  });

  if (checkStorage()) {
    loadData();
  }
});

document.addEventListener(RENDER_DATA, function () {
  const uncompleteBookList = document.getElementById("incompleteBookshelfList");
  uncompleteBookList.innerHTML = "";
  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookList.innerHTML = "";

  for (const bookItems of books) {
    const bookElement = createListBooks(bookItems);

    if (!bookItems.isComplete) {
      uncompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});
