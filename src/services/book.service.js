import { Book } from "../models/Book.js";

export const findBooks = async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
};

export const findBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findOne({ where: { id } });

    if (!book)
        return res.status(404).send({ message: "Libro no encontrado" });

    res.send(book);
}

export const createBook = async (req, res) => {
    const { title, author, rating, pageCount, summary, imageUrl, available } = req.body;

    // Title and author are required
    if (!title || !author)
        return res.status(400).send({ message: "Título y autor son campos requeridos" });

    const newBook = await Book.create({
        title,
        author,
        rating,
        pageCount,
        summary,
        imageUrl,
        available
    });

    res.send(newBook)
};

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, rating, pageCount, summary, imageUrl, available } = req.body;

    // Title and author are required
    if (!title || !author)
        return res.status(400).send("Título y autor son campos requeridos");

    // Find the book
    const book = await Book.findByPk(id);

    if (!book)
        return res.status(404).send({ message: "Libro no encontrado" });

    // Update it
    await book.update({
        title,
        author,
        rating,
        pageCount,
        summary,
        imageUrl,
        available
    });

    await book.save();

    res.send(book);

};

export const deleteBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book)
        return res.status(404).send({ message: "Libro no encontrado" });

    await book.destroy();

    res.send(`Libro con id: ${id} eliminado`);
}