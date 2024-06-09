const mutationObserver = new MutationObserver(() => {
  document.querySelectorAll("button.fa-trash-can").forEach((button) => {
    button.addEventListener("click", deleteBook)
  })
  document.querySelectorAll("button.fa-solid").forEach((button) => {
    button.addEventListener("click", toggleStatus)
  })
})
const container = document.querySelector(".container") as HTMLElement
mutationObserver.observe(container, { childList: true })

class Book {
  title: string
  author: string
  pages: string
  status: string
  index: number
  constructor(title: string, author: string, pages: string, status: string) {
    this.title = title
    this.author = author
    this.pages = pages
    this.status = status
    this.index = count
  }
  toggleReadStatus() {
    this.status = this.status === "Read" ? "Not read" : "Read"
  }
}

const myLibrary: Book[] = []
let count = 0

function getBookFormValues() {
  const titleInput = document.querySelector("#title") as HTMLInputElement
  const authorInput = document.querySelector("#author") as HTMLInputElement
  const pagesInput = document.querySelector("#pages") as HTMLInputElement
  const statusInput = document.querySelector("#read") as HTMLInputElement
  const status = statusInput.checked ? "Read" : "Not read"
  return [titleInput.value, authorInput.value, pagesInput.value, status]
}

function createBookObject(array: string[]) {
  const [title, author, pages, status] = array
  const newBook = new Book(title, author, pages, status)
  myLibrary.push(newBook)
}

const resetButton = document.querySelector(
  'input[type="reset"]'
) as HTMLButtonElement

function appendToDOM(array: string[]) {
  const [title, author, pages, status] = array

  // Create book elements
  const newBookElement = document.createElement("details")
  const newSummaryElement = document.createElement("summary")
  const newTitleElement = document.createElement("span")
  const newAuthorElement = document.createElement("span")
  const newPagesElement = document.createElement("p")
  const newStatusElement = document.createElement("p")
  const newButtonGroup = document.createElement("div")
  const newDeleteElement = document.createElement("button")
  const newToggleElement = document.createElement("button")

  // Set text content for new elements
  newTitleElement.textContent = title
  newAuthorElement.textContent = author
  newPagesElement.textContent = pages
  newStatusElement.textContent = status

  // Assign classes or role
  newBookElement.classList.add("book")
  newTitleElement.classList.add("title")
  newAuthorElement.classList.add("author")
  newPagesElement.classList.add("pages")
  newStatusElement.classList.add("status")
  newButtonGroup.setAttribute("role", "group")
  newDeleteElement.classList.add("outline", "fa-regular", "fa-trash-can")
  newToggleElement.classList.add("outline", "fa-solid")
  status == "Read"
    ? newToggleElement.classList.add("fa-toggle-on")
    : newToggleElement.classList.add("fa-toggle-off")

  // Assign data attribute
  newBookElement.setAttribute("data-index", `${count}`)
  newStatusElement.setAttribute("data-index", `${count}`)
  newDeleteElement.setAttribute("data-index", `${count}`)
  newToggleElement.setAttribute("data-index", `${count}`)
  count++

  // Append new elements
  container.appendChild(newBookElement)
  newBookElement.appendChild(newSummaryElement)
  newSummaryElement.appendChild(newTitleElement)
  newSummaryElement.appendChild(newAuthorElement)
  newBookElement.appendChild(newPagesElement)
  newBookElement.appendChild(newStatusElement)
  newBookElement.appendChild(newButtonGroup)
  newButtonGroup.appendChild(newDeleteElement)
  newButtonGroup.appendChild(newToggleElement)

  resetButton.click()
}

function deleteBook(event: Event) {
  let eventIndex
  let target = event.target as HTMLElement
  eventIndex = +target.dataset.index!
  myLibrary.splice(eventIndex, 1)

  const delBtn = document.querySelector(
    `details[data-index="${eventIndex}"] button.fa-trash-can`
  ) as HTMLButtonElement
  delBtn.removeEventListener("click", deleteBook)

  const readToggleBtn = document.querySelector(
    `details[data-index="${eventIndex}"] button.fa-solid`
  ) as HTMLButtonElement
  readToggleBtn.removeEventListener("click", toggleStatus)

  const bookToRemove = document.querySelector(
    `details[data-index="${eventIndex}"]`
  ) as HTMLElement
  bookToRemove.remove()

  myLibrary.forEach((book, index) => {
    book.index = index
  })
  document.querySelectorAll(".book").forEach(reassignIndex)
  document.querySelectorAll("button.fa-trash-can").forEach(reassignIndex)
  document.querySelectorAll(".status").forEach(reassignIndex)
  document.querySelectorAll("button.fa-solid").forEach(reassignIndex)
  count--
}

function reassignIndex(item: Node, index: number) {
  let currItem = item as HTMLElement
  currItem.setAttribute("data-index", `${index}`)
}

function toggleStatus(event: Event) {
  let eventIndex
  let target = event.target as HTMLElement
  eventIndex = +target.dataset.index!
  myLibrary[eventIndex].toggleReadStatus()
  const toggleElement = document.querySelector(
    `.fa-solid[data-index="${eventIndex}"]`
  ) as HTMLButtonElement
  toggleElement.classList.toggle("fa-toggle-on")
  toggleElement.classList.toggle("fa-toggle-off")
  const textReplace = document.querySelector(
    `.status[data-index="${eventIndex}"]`
  ) as HTMLParagraphElement
  textReplace.textContent = myLibrary[eventIndex].status
}

// Open dialog button
const openDialogBtn = document.querySelector(".add-book") as HTMLButtonElement
const dialog = document.querySelector("dialog") as HTMLDialogElement
openDialogBtn.addEventListener("click", () => dialog.showModal())

// Form submit button

const addBookButton = document.querySelector(
  'button[type="submit"]'
) as HTMLButtonElement
addBookButton.addEventListener("click", (event) => {
  event.preventDefault()

  //Input Validation
  const inputs = document.querySelectorAll("input")
  for (let input of inputs) {
    if (!input.validity.valid) {
      input.reportValidity()
      return
    }
  }

  createBookObject(getBookFormValues())
  appendToDOM(getBookFormValues())
  dialog.close()
})

// Close dialog button
const closeDialogBtn = document.querySelector(".fa-xmark") as HTMLButtonElement
closeDialogBtn.addEventListener("click", () => {
  resetButton.click()
  dialog.close()
})

// Sample books
document.addEventListener("DOMContentLoaded", () => {
  createBookObject([
    "Relativity - The Special And General Theory",
    "Albert Einstein",
    "164",
    "Not read",
  ])
  appendToDOM([
    "Relativity - The Special And General Theory",
    "Albert Einstein",
    "164",
    "Not read",
  ])

  createBookObject([
    "Brief Answers to the Big Question",
    "Stephen Hawking",
    "256",
    "Read",
  ])
  appendToDOM([
    "Brief Answers to the Big Question",
    "Stephen Hawking",
    "256",
    "Read",
  ])

  createBookObject(["The Selfish Gene", "Richard Dawkins", "224", "Not read"])
  appendToDOM(["The Selfish Gene", "Richard Dawkins", "224", "Not read"])
})
