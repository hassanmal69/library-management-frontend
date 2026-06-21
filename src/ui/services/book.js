import fetchClient from "../utils/interceptor";

// 📚 GET all books
export const getBooks = async () => {
  try {
    const data = await fetchClient("/books");
    return data.data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch books" };
  }
};

export const getBookById = async (id) => {
  try {
    const data = await fetchClient(`/books/${id}`);
    return data.data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch book" };
  }
};

export const createBook = async (payload) => {
  try {
    const data = await fetchClient("/books", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to create book" };
  }
};

export const updateBook = async (id, payload) => {
  try {
    const data = await fetchClient(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to update book" };
  }
};

export const deleteBook = async (id) => {
  try {
    const data = await fetchClient(`/books/${id}`, {
      method: "DELETE",
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to delete book" };
  }
};