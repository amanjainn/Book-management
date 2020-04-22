// Book constructor

function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}


// Ui construstor 
function UI() { }

UI.prototype.addBooKToList = function (book) {
    //console.log(book);
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href ="#" class ="delete"> X<a> </td>
    `;
    list.appendChild(row);
}

UI.prototype.deleteBook=function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}


UI.prototype.showAlert = function (message,className){
    const div = document.querySelector('#alert-text');
    div.className =`alert ${className}`;
    div.appendChild(document.createTextNode(message));
  const child = div.firstChild;
    setTimeout(function(){
        document.querySelector('.alert').remove();
    },3000);

}

UI.prototype.clearFields = function () {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
}


// Local storage classs
class Store{

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
             books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;

            ui.addBooKToList(book);
        })
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

         localStorage.setItem('books', JSON.stringify(books));
    }
  
}

// DOM LOAD EVENT

document.addEventListener('DomContentLoaded',Store.displayBooks);

// Event listeners
document.getElementById('book-form').addEventListener('submit', function (e) {
 
    // Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    // Instantiate book
    const book = new Book(title, author, isbn);
    // Instantitate UI
    const ui = new UI();

    if(title ==='' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all fields' ,'error')

    }else{
    // Add book to list
    ui.addBooKToList(book);

     Store.addBook(book);    

    ui.showAlert('Book Added!' , 'success');
    ui.clearFields();

    }

    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click',function(e){


const ui = new UI ;
 ui.deleteBook(e.target);

 Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

ui.showAlert('Book Removed!' , 'success');

e.preventDefault();

})