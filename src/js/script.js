const booksTemplate = Handlebars.compile(document.getElementById('template-book').innerHTML);
const booksList = document.querySelector('.books-list');

class BooksList {
  constructor() {
    this.favoriteBooks = [];
    this.filters = [];

    this.initData();
    this.getElements();
    this.render();
    this.initActions();
  }

  initData() {
    this.data = dataSource.books;
  }

  render() {
    for (let book of this.data) {
      const ratingBgc = this.determineRatingBgc(book.rating);
      const ratingWidth = book.rating * 10;


      book.ratingBgc = ratingBgc;
      book.ratingWidth = ratingWidth;

      const generatedHTML = booksTemplate(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      this.dom.booksList.appendChild(generatedDOM);
    }
  }

  getElements() {
    this.dom = {};
    this.dom.booksList = document.querySelector('.books-list');
    this.dom.form = document.querySelector('.filters');
  }

  initActions() {
    this.dom.booksList.addEventListener('dblclick', (event) => {
      const isImageOrLink = event.target.tagName.toLowerCase() === 'img';

      if (isImageOrLink) {
        event.preventDefault();
        const bookId = event.target.closest('.book__image').getAttribute('data-id');
        const isFavorite = event.target.closest('.book__image').classList.contains('favorite');

        if (isFavorite) {
          event.target.closest('.book__image').classList.remove('favorite');
          const index = this.favoriteBooks.indexOf(bookId);
          if (index !== -1) {
            this.favoriteBooks.splice(index, 1);
          }
          console.log('Usunięto z ulubionych:', this.favoriteBooks);
        } else {
          event.target.closest('.book__image').classList.add('favorite');
          this.favoriteBooks.push(bookId);
          console.log('Dodano do ulubionych:', this.favoriteBooks);
        }
      }
    });

    this.dom.form.addEventListener('click', (event) => {
      const isCheckbox =
        event.target.tagName.toLowerCase() === 'input' &&
        event.target.type === 'checkbox' &&
        event.target.name === 'filter';

      if (isCheckbox) {
        const checkboxValue = event.target.value;

        if (event.target.checked) {
          if (!this.filters.includes(checkboxValue)) {
            this.filters.push(checkboxValue);
          }
        } else {
          const index = this.filters.indexOf(checkboxValue);
          if (index !== -1) {
            this.filters.splice(index, 1);
          }
        }

        this.filterBooks();
        console.log('Aktualne filtry:', this.filters);
      }
    });
  }

  filterBooks() {
    for (let book of this.data) {
      let shouldBeHidden = false;
      for (let filter of this.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const filteredBook = document.querySelector('.book__image[data-id="' + book.id + '"]');

      if (shouldBeHidden) {
        filteredBook.classList.add('hidden');
      } else {
        filteredBook.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating) {
    if (rating >= 9) {
      return 'linear-gradient(to bottom, #ff0000 0%, #ff0000 100%)';
    } else if (rating >= 7) {
      return 'linear-gradient(to bottom, #ffa500 0%, #ffa500 100%)';
    } else {
      return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
    }
  }
}
const app = new BooksList();
