document.addEventListener("DOMContentLoaded", function() {
    const addBookForm = document.getElementById("add-book-form");
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const yearInput = document.getElementById("year");
    const isCompleteCheckbox = document.getElementById("is-complete");
    const unfinishedBooksList = document.getElementById("unfinished-books");
    const completedBooksList = document.getElementById("completed-books");
    const searchInput = document.getElementById("search-input");

    // Function to create a new book element
    function createBookElement(book) {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis : ${book.author}</p>
            <p>Tahun : ${book.year}</p>
            <button class="move-to-${book.isComplete ? 'unfinished' : 'completed'}">${book.isComplete ? 'Belum Selesai' : 'Selesai'}</button>
            <button class="delete-book">Hapus</button>
        `;
        return bookDiv;
    }

    // Function to add a new book
    function addBook(event) {
        event.preventDefault();
        
        const newBook = {
            id: +new Date(),
            title: titleInput.value,
            author: authorInput.value,
            year: parseInt(yearInput.value),
            isComplete: isCompleteCheckbox.checked
        };

        const bookList = newBook.isComplete ? completedBooksList : unfinishedBooksList;
        const bookElement = createBookElement(newBook);
        bookList.appendChild(bookElement);
        
        // Save book to localStorage
        saveBooks();
        
        // Clear form inputs
        titleInput.value = '';
        authorInput.value = '';
        yearInput.value = '';
        isCompleteCheckbox.checked = false;
    }

    // Function to move book between shelves
    function moveBook(event) {
        const button = event.target;
        const book = button.parentElement;
        const bookList = book.parentElement;

        if (button.classList.contains('move-to-unfinished')) {
            button.textContent = 'Selesai';
            button.classList.remove('move-to-unfinished');
            button.classList.add('move-to-completed');
            unfinishedBooksList.appendChild(book);
        } else if (button.classList.contains('move-to-completed')) {
            button.textContent = 'Belum Selesai';
            button.classList.remove('move-to-completed');
            button.classList.add('move-to-unfinished');
            completedBooksList.appendChild(book);
        }

        // Save books to localStorage
        saveBooks();
    }

    // Function to delete book
    function deleteBook(event) {
        const book = event.target.parentElement;
        
        // Custom dialog
        const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
        if (isConfirmed) {
            const bookList = book.parentElement;
            bookList.removeChild(book);

            // Save books to localStorage
            saveBooks();
        }
    }

    // Function to save books to localStorage
    function saveBooks() {
        localStorage.setItem('unfinishedBooks', unfinishedBooksList.innerHTML);
        localStorage.setItem('completedBooks', completedBooksList.innerHTML);
    }

    // Function to search books by title
    function searchBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const allBooks = [...document.querySelectorAll('.book')];

        allBooks.forEach(book => {
            const title = book.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    }

    // Event listeners
    addBookForm.addEventListener("submit", addBook);
    unfinishedBooksList.addEventListener("click", function(event) {
        if (event.target.classList.contains('move-to-unfinished') || event.target.classList.contains('move-to-completed')) {
            moveBook(event);
        } else if (event.target.classList.contains('delete-book')) {
            deleteBook(event);
        }
    });
    completedBooksList.addEventListener("click", function(event) {
        if (event.target.classList.contains('move-to-unfinished') || event.target.classList.contains('move-to-completed')) {
            moveBook(event);
        } else if (event.target.classList.contains('delete-book')) {
            deleteBook(event);
        }
    });

    searchInput.addEventListener("input", searchBooks);

    // Load books from localStorage
    if (localStorage.getItem('unfinishedBooks')) {
        unfinishedBooksList.innerHTML = localStorage.getItem('unfinishedBooks');
    }
    if (localStorage.getItem('completedBooks')) {
        completedBooksList.innerHTML = localStorage.getItem('completedBooks');
    }
});
