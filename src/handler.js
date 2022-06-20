const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Handler for post book to the server
 * @param {any} request
 * @param {any} h
 * @returns
 */
const postBook = (request, h) => {
  // get the data from request body
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(12);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (readPage === pageCount);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // push data to books array from ./books.js
  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  // check if book is sended
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/**
 * get all books from array books
 * @param {any} request
 * @param {any} h
 */
const getBooks = (request, h) => {
  let book = [];

  books.forEach((b) => {
    book.push({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    });
  });

  const { name, reading, finished } = request.query;

  // return response of all books with same name from query paramaters
  // if (name) {
  //   book = book.filter((b) => b.name.toLowerCase() === nameQuery.toLowerCase());
  //   if (book !== undefined) {
  //     //
  //   }
  // }
  // return response of all books is read or not read
  if (reading) {
    if (reading === '0') {
      book = books.filter((b) => b.reading === false);
      console.log(book);
    } else if (reading === '1') {
      book = books.filter((b) => b.reading === true);
    }
  }
  if (finished) {
  // return response of all finished or not finished books
    if (finished === '0') {
      book = books.filter((b) => b.finished === false);
    } else if (finished === '1') {
      book = books.filter((b) => b.finished === true);
    }
  }
  console.log(book);
  const response = h.response({
    status: 'success',
    data: {
      books: book,
    },
  });
  response.code(200);
  return response;
};

/**
 *get specific book by id
 * @param {any} request
 * @param {any} h
 * @returns
 */
const getBookById = (request, h) => {
  const { bookId } = request.params;
  const isBookIdExist = books.filter((book) => book.id === bookId)[0];
  if (isBookIdExist !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: isBookIdExist,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookById = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const { bookId } = request.params;
  const indexOfUpdatedBook = books.findIndex((book) => book.id === bookId);
  if (indexOfUpdatedBook !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    books[indexOfUpdatedBook] = {
      ...books[indexOfUpdatedBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => bookId === book.id);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postBook, getBooks, getBookById, updateBookById, deleteBookById,
};
