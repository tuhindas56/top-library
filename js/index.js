const mutationObserver = new MutationObserver(() => {
  document.querySelectorAll("button.fa-trash-can").forEach((button) => {
    button.addEventListener("click", deleteBook);
  });
  document.querySelectorAll("button.fa-solid").forEach((button) => {
    button.addEventListener("click", toggleStatus);
  });
});
mutationObserver.observe(document.querySelector(".container"), { childList: true });

const myLibrary = [];
let count = 0;

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.index = count;
}

Book.prototype.toggleReadStatus = function () {
  this.status = this.status === "Read" ? "Not read" : "Read";
};

function getBookFormValues() {
  const titleInput = document.querySelector("#title");
  const authorInput = document.querySelector("#author");
  const pagesInput = document.querySelector("#pages");
  const statusInput = document.querySelector("#read");
  const status = statusInput.checked ? "Read" : "Not read";
  return [titleInput.value, authorInput.value, pagesInput.value, status];
}

function createBookObject(array) {
  const [title, author, pages, status] = array;
  const newBook = new Book(title, author, pages, status);
  myLibrary.push(newBook);
}

function appendToDOM(array) {
  const [title, author, pages, status] = array;
  const bookContainer = document.querySelector(".container");

  // Create book elements
  const newBookElement = document.createElement("details");
  const newSummaryElement = document.createElement("summary");
  const newTitleElement = document.createElement("span");
  const newAuthorElement = document.createElement("span");
  const newPagesElement = document.createElement("p");
  const newStatusElement = document.createElement("p");
  const newButtonGroup = document.createElement("div");
  const newDeleteElement = document.createElement("button");
  const newToggleElement = document.createElement("button");

  // Set text content for new elements
  newTitleElement.textContent = title;
  newAuthorElement.textContent = author;
  newPagesElement.textContent = pages;
  newStatusElement.textContent = status;

  // Assign classes or role
  newBookElement.classList.add("book");
  newTitleElement.classList.add("title");
  newAuthorElement.classList.add("author");
  newPagesElement.classList.add("pages");
  newStatusElement.classList.add("status");
  newButtonGroup.setAttribute("role", "group");
  newDeleteElement.classList.add("outline", "fa-regular", "fa-trash-can");
  newToggleElement.classList.add("outline", "fa-solid");
  status == "Read" ? newToggleElement.classList.add("fa-toggle-on") : newToggleElement.classList.add("fa-toggle-off");

  // Assign data attribute
  newBookElement.setAttribute("data-index", count);
  newStatusElement.setAttribute("data-index", count);
  newDeleteElement.setAttribute("data-index", count);
  newToggleElement.setAttribute("data-index", count);
  count++;

  // Append new elements
  bookContainer.appendChild(newBookElement);
  newBookElement.appendChild(newSummaryElement);
  newSummaryElement.appendChild(newTitleElement);
  newSummaryElement.appendChild(newAuthorElement);
  newBookElement.appendChild(newPagesElement);
  newBookElement.appendChild(newStatusElement);
  newBookElement.appendChild(newButtonGroup);
  newButtonGroup.appendChild(newDeleteElement);
  newButtonGroup.appendChild(newToggleElement);

  document.querySelector('input[type="reset"]').click();
}

function deleteBook(event) {
  let eventIndex;
  eventIndex = +event.target.dataset.index;
  myLibrary.splice(eventIndex, 1);
  document
    .querySelector(`details[data-index="${eventIndex}"] button.fa-trash-can`)
    .removeEventListener("click", deleteBook);
  document
    .querySelector(`details[data-index="${eventIndex}"] button.fa-solid`)
    .removeEventListener("click", toggleStatus);
  document.querySelector(`details[data-index="${eventIndex}"]`).remove();
  myLibrary.forEach((book, index) => {
    book.index = index;
  });
  document.querySelectorAll(".book").forEach(reassignIndex);
  document.querySelectorAll("button.fa-trash-can").forEach(reassignIndex);
  document.querySelectorAll(".status").forEach(reassignIndex);
  document.querySelectorAll("button.fa-solid").forEach(reassignIndex);
  count--;
}

function reassignIndex(item, index) {
  item.setAttribute("data-index", `${index}`);
}

function toggleStatus(event) {
  let eventIndex;
  eventIndex = +event.target.dataset.index;
  myLibrary[eventIndex].toggleReadStatus();
  const toggleElement = document.querySelector(`.fa-solid[data-index="${eventIndex}"]`);
  toggleElement.classList.toggle("fa-toggle-on");
  toggleElement.classList.toggle("fa-toggle-off");
  const textReplace = document.querySelector(`.status[data-index="${eventIndex}"]`);
  textReplace.textContent = myLibrary[eventIndex].status;
}

// Open dialog button
document.querySelector(".add-book").addEventListener("click", () => document.querySelector("dialog").showModal());

// Form submit button
const addBookButton = document.querySelector('button[type="submit"]');
addBookButton.addEventListener("click", (event) => {
  event.preventDefault();

  //Input Validation
  const inputs = document.querySelectorAll("input");
  for (let input of inputs) {
    if (input.value == null || input.value == "") {
      return;
    }
  }

  createBookObject(getBookFormValues());
  appendToDOM(getBookFormValues());
  document.querySelector("dialog").close();
});

// Close dialog button
document.querySelector(".fa-xmark").addEventListener("click", () => {
  document.querySelector('input[type="reset"]').click();
  document.querySelector("dialog").close();
});

// Sample books
document.addEventListener("DOMContentLoaded", () => {
  createBookObject(["Relativity - The Special And General Theory", "Albert Einstein", "164", "Not read"]);
  appendToDOM(["Relativity - The Special And General Theory", "Albert Einstein", "164", "Not read"]);

  createBookObject(["Brief Answers to the Big Question", "Stephen Hawking", "256", "Read"]);
  appendToDOM(["Brief Answers to the Big Question", "Stephen Hawking", "256", "Read"]);

  createBookObject(["The Selfish Gene", "Richard Dawkins", "224", "Not read"]);
  appendToDOM(["The Selfish Gene", "Richard Dawkins", "224", "Not read"]);
});
