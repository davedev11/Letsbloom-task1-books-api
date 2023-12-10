const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
const { connectDB, getDB } = require("./db");
const dbConn = getDB(process.env.DB_NAME);
const seedData = require("./data.json");

app.use(bodyParser.json());

//end point to seed the database
app.get("/api/seed", async (req, res) => {
  try {
    await dbConn.collection("books").deleteMany({});
    await dbConn.collection("books").insertMany(seedData);
    return res
      .status(200)
      .json({ success: true, message: "database seeding success" });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "An internal server error occured while seeding",
    });
  }
});

//end point to get all books
app.get("/api/books", async (req, res) => {
  try {
    const data = await dbConn
      .collection("books")
      .aggregate([
        {
          $match: {},
        },
        {
          $project: { _id: 0 },
        },
      ])
      .toArray();
    return res.status(200).json({ success: true, message: data });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "An error occured while retreving the data",
    });
  }
});

//end point to create a new book
app.post("/api/books", async (req, res) => {
  try {
    const { book_id, book_name, author, publisher, isbn } = req.body;
    if (!book_id || !book_name || !author || !publisher || !isbn) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient details" });
    } else {
      const duplicateBook = await dbConn
        .collection("books")
        .aggregate([
          {
            $match: { book_id },
          },
        ])
        .toArray();
      if (duplicateBook.length != 0) {
        return res.status(400).json({
          success: false,
          message: "A book already exists with the same ID",
        });
      } else {
        const newData = { book_id, book_name, author, publisher, isbn };
        await dbConn.collection("books").insertOne(newData);
        return res
          .status(200)
          .json({ success: true, message: "Book added to the database" });
      }
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message:
        "An internal server occured while adding the book to the database",
    });
  }
});

//end point to get the details of specfic book
app.get("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await dbConn
      .collection("books")
      .aggregate([
        {
          $match: { book_id: id },
        },
        {
          $project: { _id: 0 },
        },
      ])
      .toArray();
    if (book.length == 0) {
      return res.status(404).json({
        success: false,
        message: "The book with the requested id does not exist",
      });
    } else {
      return res.status(200).json({ success: true, message: book[0] });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message:
        "A server side error occured while retreving the details of the book",
    });
  }
});

//end point to update a specific books based on the book id
app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = await dbConn
      .collection("books")
      .aggregate([
        {
          $match: { book_id: id },
        },
      ])
      .toArray();
    if (bookData.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No such book exists with the given ID",
      });
    } else {
      const { book_id, book_name, author, publisher, isbn } = req.body;
      if (book_id) {
        return res
          .status(400)
          .json({ success: false, message: "You cannot change the ID of the book" });
      } else {
        await dbConn.collection("books").updateOne(
          { book_id: id },
          {
            $set: req.body,
          }
        );
        return res
          .status(200)
          .json({ success: true, message: "Details of the book are updated" });
      }
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "An internal server error occured while updating the book",
    });
  }
});

// remove specific book form the database
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = await dbConn
      .collection("books")
      .aggregate([
        {
          $match: { book_id: id },
        },
      ])
      .toArray();

    if (bookData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No such book exists with the given ID",
      });
    }

    const deletedBook = await dbConn.collection("books").findOneAndDelete({
      book_id: id,
    });

    return res.json({
      success: true,
      message: "Book deleted from the database",
      deletedBook: deletedBook.value,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while deleting the book",
    });
  }
});



connectDB()
  .then((res) => {
    console.log(res);
    app.listen(PORT, () => {
      console.log("Server started listening");
    });
  })
  .catch((e) => {
    console.log("Error occured", e);
  });
