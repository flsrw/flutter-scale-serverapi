const connection = require("../utils/db")
const multer = require('multer')
const multerConfig = require('../utils/multer_config')
const upload = multer(multerConfig.config).single(multerConfig.keyUpload)

// Get all products
function getAllProducts(req, res) {
  try {
    connection.execute(
      "SELECT * FROM products ORDER BY id DESC", function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          res.json(results)
        }
      }
    )
  } catch (err) {
    console.error("Error storing product in the database: ", err)
    res.sendStatus(500)
  }
}

// Get product by id
function getProductById(req, res) {
  try {
    connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [req.params.productId],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          res.json(results)
        }
      }
    )
  } catch (err) {
    console.error("Error storing product in the database: ", err)
    res.sendStatus(500)
  }
}

// Create product
function createProduct(req, res) {

  upload(req, res, async (err) => {

    if (err instanceof multer.MulterError) {
        console.log(`error: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: err })
    } else if (err) {
        console.log(`error: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: err })
    } else {
        console.log(`file: ${JSON.stringify(req.file)}`)
        console.log(`body: ${JSON.stringify(req.body)}`)
        try {
          const { name, description, barcode, stock, price, category_id, user_id, status_id } = req.body
          const image = req.file ? req.file.filename : null
          console.log(req.file)
          connection.execute(
            "INSERT INTO products (name, description, barcode, image, stock, price, category_id, user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, description, barcode, image, stock, price, category_id, user_id, status_id],
            function (err, results, fields) {
              if (err) {
                res.json({ status: "error", message: err })
                return
              } else {
                res.json({
                  status: "ok",
                  message: "Product created successfully",
                  product: {
                    id: results.insertId,
                    name: name,
                    description: description,
                    barcode: barcode,
                    image: image,
                    stock: stock,
                    price: price,
                    category_id: category_id,
                    user_id: user_id,
                    status_id: status_id
                  },
                })
              }
            }
          )
        } catch (err) {
          console.error("Error storing product in the database: ", err)
          res.sendStatus(500)
        }
    }

  })

}

// Update product
function updateProduct(req, res) {

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
        console.log(`error: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: err })
    } else if (err) {
        console.log(`error: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: err })
    } else {
        console.log(`file: ${JSON.stringify(req.file)}`)
        console.log(`body: ${JSON.stringify(req.body)}`)
        try {
          const { name, description, barcode, image, stock, price, category_id, user_id, status_id } = req.body
          const newImage = req.file ? req.file.filename : image
          console.log(req.file)
      
          connection.execute(
            "UPDATE products SET name = ?, description = ?, barcode = ?, image = ?, stock = ?, price = ?, category_id = ?, user_id = ?, status_id = ? WHERE id = ?",
            [name, description, barcode, newImage, stock, price, category_id, user_id, status_id, req.params.productId],
            function (err, results, fields) {
              if (err) {
                res.json({ status: "error", message: err })
                return
              } else {
                res.json({
                  status: "ok",
                  message: "Product updated successfully",
                  product: {
                    id: req.params.productId,
                    name: name,
                    description: description,
                    barcode: barcode,
                    image: newImage,
                    stock: stock,
                    price: price,
                    category_id: category_id,
                    user_id: user_id,
                    status_id: status_id
                  },
                })
              }
            }
          )
        } catch (err) {
          console.error("Error storing product in the database: ", err)
          res.sendStatus(500)
        }
    }
  })
}

// Delete product
function deleteProduct(req, res) {
  try {
    connection.execute(
      "DELETE FROM products WHERE id = ?",
      [req.params.productId],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          res.json({
            status: "ok",
            message: "Product deleted successfully",
            product: {
              id: req.params.productId
            },
          })
        }
      }
    )
  } catch (err) {
    console.error("Error storing product in the database: ", err)
    res.sendStatus(500)
  }
}


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
