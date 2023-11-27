const { nanoid } = require("nanoid");
const books = require("./books");

// Menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Cek apakah name tidak ada
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Cek apakah readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
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
  };

  // Menambahkan buku ke array books
  books.push(newBook);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Cek apakah ada query name
  if (name) {
    const response = h.response({
      status: "success",
      data: {
        books: books
          .filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
          )
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  // Cek apakah ada query reading
  if (reading) {
    const response = h.response({
      status: "success",
      data: {
        books: books
          .filter((book) => book.reading === !!Number(reading))
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  // Cek apakah ada query finished
  if (finished) {
    const response = h.response({
      status: "success",
      data: {
        books: books
          .filter((book) => book.finished === !!Number(finished))
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  // Jika tidak ada query
  const response = h.response({
    status: "success",
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan id
  const book = books.filter((book) => book.id === bookId)[0];

  // Cek apakah buku ditemukan
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // Buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Mengubah data buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan id
  const index = books.findIndex((book) => book.id === bookId);

  // Cek apakah buku ditemukan
  if (index !== -1) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    // Cek apakah name tidak ada
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    // Cek apakah readPage lebih besar dari pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    // Mengubah data buku
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  // Buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan id
  const index = books.findIndex((book) => book.id === bookId);

  // Cek apakah buku ditemukan
  if (index !== -1) {
    // Menghapus buku
    books.splice(index, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  // Buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
