document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "BOOKSHELF_APP";
  let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const bookForm = document.querySelector("[data-testid='bookForm']");
  const searchForm = document.querySelector("[data-testid='searchBookForm']");
  const incompleteBookList = document.querySelector("[data-testid='incompleteBookList']");
  const completeBookList = document.querySelector("[data-testid='completeBookList']");
  const bookModal = document.getElementById("bookModal");
  const editBookModal = document.getElementById("editBookModal");

  function saveToLocalStorage() {
    if (Array.isArray(books)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }

  function updateBookCount() {
    document.getElementById("totalBooks").textContent = books.length;
  }

  function createBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.className = "text-white border border-gray-800 rounded-lg bg-gray-900 p-4 space-y-2 h-fit";

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle" class="text-[24px] font-bold">${book.title}</h3>
      <p data-testid="bookItemAuthor" class="text-[18px]">Author: ${book.author}</p>
      <p data-testid="bookItemYear" class="text-[18px]">Year: ${book.year}</p>
      <div class="flex gap-x-2">
        <button data-testid="bookItemIsCompleteButton" class="rounded items-center gap-1"">
          ${book.isComplete ? 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-green-500"><path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>'
            : 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-green-500"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>'}
        </button>
        <button data-testid="bookItemDeleteButton" class="rounded items-center gap-1"">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-500"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
        <button data-testid="bookItemEditButton" class="rounded items-center gap-1"">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-yellow-500">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
        </button>
      </div>
    `;

    bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => {
      book.isComplete = !book.isComplete;
      saveToLocalStorage();
      renderBooks();
    });

    bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => {
      books = books.filter((b) => b.id !== book.id);
      saveToLocalStorage();
      renderBooks();
    });

    bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => {
      openEditForm(book);
    });

    return bookElement;
  }

  function renderBooks() {    
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
    });
    updateBookCount();
  }

  function openEditForm(book) {
    const editBookForm = document.getElementById("editBookForm");
    const editBookTitle = document.getElementById("editBookTitle");
    const editBookAuthor = document.getElementById("editBookAuthor");
    const editBookYear = document.getElementById("editBookYear");
    const editBookIsComplete = document.getElementById("editBookIsComplete");

    if (!editBookForm || !editBookModal) {
      console.error("Edit form or modal not found!");
      return;
    }

    editBookTitle.value = book.title;
    editBookAuthor.value = book.author;
    editBookYear.value = book.year;
    editBookIsComplete.checked = book.isComplete;

    editBookModal.classList.remove("hidden");
    editBookModal.classList.add("opacity-100");

    editBookForm.onsubmit = (event) => {
      event.preventDefault();
      book.title = editBookTitle.value;
      book.author = editBookAuthor.value;
      book.year = parseInt(editBookYear.value, 10);
      book.isComplete = editBookIsComplete.checked;

      saveToLocalStorage();
      renderBooks();
      editBookModal.classList.add("hidden");
      editBookModal.classList.remove("opacity-100");
    };

    document.getElementById("cancelEdit").addEventListener("click", () => {
      editBookModal.classList.add("hidden");
      editBookModal.classList.remove("opacity-100");
    });
  }

  if (bookForm) {
    document.getElementById("addBook").addEventListener("click", () => {
      bookModal.classList.remove("hidden");
    });

    document.getElementById("cancelAdd").addEventListener("click", () => {
      bookForm.reset();
      bookModal.classList.add("hidden");
    });

    bookForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.querySelector("[data-testid='bookFormTitleInput']").value;
      const author = document.querySelector("[data-testid='bookFormAuthorInput']").value;
      const year = parseInt(document.querySelector("[data-testid='bookFormYearInput']").value, 10);
      const isComplete = document.getElementById("bookFormIsComplete").checked;

      const newBook = { id: +new Date(), title, author, year, isComplete };

      books.push(newBook);
      saveToLocalStorage();
      renderBooks();
      bookForm.reset();
      bookModal.classList.add("hidden");
    });
  } else {
    console.error("bookForm tidak ditemukan di HTML!");
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTitle = document.querySelector("[data-testid='searchBookFormTitleInput']").value.toLowerCase();

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.filter(book => book.title.toLowerCase().includes(searchTitle)).forEach(book => {
      const bookElement = createBookElement(book);
      book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
    });
  });

  renderBooks();
});

function sendEmail() {
  let subject = document.getElementById("subject").value;
  
  if (!subject) {
      alert("Please fill in both fields!");
      return;
  }

  let sub = encodeURIComponent(`${subject}`);
  
  // URL untuk membuka Gmail di browser dengan pesan otomatis
  let gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=ariyanandryan@gmail.com&su=${sub}`;

  // Buka Gmail di tab baru
  window.open(gmailLink, "_blank");
}