const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];
let editingBookId = null;

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
  renderBooks();
}

// Elemen buku sesuai template ketentuan
function createBookElement(book) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', book.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const titleEl = document.createElement('h3');
  titleEl.setAttribute('data-testid', 'bookItemTitle');
  titleEl.innerText = book.title;

  const authorEl = document.createElement('p');
  authorEl.setAttribute('data-testid', 'bookItemAuthor');
  authorEl.innerText = `Penulis: ${book.author}`;

  const yearEl = document.createElement('p');
  yearEl.setAttribute('data-testid', 'bookItemYear');
  yearEl.innerText = `Tahun: ${book.year}`;

  const actionContainer = document.createElement('div');

  // Tombol pindah rak
  const completeBtn = document.createElement('button');
  completeBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeBtn.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeBtn.addEventListener('click', () => {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  });

  // Tombol hapus
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBtn.innerText = 'Hapus Buku';
  deleteBtn.addEventListener('click', () => {
    books = books.filter((b) => b.id !== book.id);
    saveData();
    renderBooks();
  });

  // Tombol edit
  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'bookItemEditButton');
  editBtn.innerText = 'Edit Buku';
  editBtn.addEventListener('click', () => {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    editingBookId = book.id;

    document.getElementById('bookFormSubmit').innerHTML = 'Simpan Perubahan';
  });

  actionContainer.appendChild(completeBtn);
  actionContainer.appendChild(deleteBtn);
  actionContainer.appendChild(editBtn);

  bookContainer.appendChild(titleEl);
  bookContainer.appendChild(authorEl);
  bookContainer.appendChild(yearEl);
  bookContainer.appendChild(actionContainer);

  return bookContainer;
}

function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Event submit form tambah/edit buku
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (editingBookId) {
    const bookIndex = books.findIndex((b) => b.id === editingBookId);
    if (bookIndex !== -1) {
      books[bookIndex].title = title;
      books[bookIndex].author = author;
      books[bookIndex].year = year;
      books[bookIndex].isComplete = isComplete;
    }
    editingBookId = null;
    document.getElementById('bookFormSubmit').innerHTML =
      'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
  } else {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
  }

  saveData();
  renderBooks();
  this.reset();
});

function searchBooks(keyword) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();
  const keyword = document.getElementById('searchBookTitle').value;
  searchBooks(keyword);
});

window.addEventListener('load', () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
