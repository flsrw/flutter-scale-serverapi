const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const connection = require("../utils/db")

// Register function
function register(req, res) {
  const { firstname, lastname, email, password } = req.body
  // Check if the user already exists
  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          if (results.length > 0) {
            res.json({ status: "error", message: "Email already exists" })
            return
          } else {
            // Hash the password
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) {
                res.json({ status: "error", message: err })
                return
              } else {
                // Store the user in the database
                const query =
                  "INSERT INTO users (firstname, lastname, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"
                const values = [firstname, lastname, email, hash]

                // Insert the new user into the database
                connection.execute(
                  query,
                  values,
                  function (err, results, fields) {
                    if (err) {
                      res.json({ status: "error", message: err })
                      return
                    } else {
                      // Generate JWT token for the registered user
                      const token = jwt.sign({ email }, process.env.JWT_SECRET)

                      res.json({
                        status: "ok",
                        message: "User registered successfully",
                        token: token,
                        user: {
                          id: results.insertId,
                          firstname: firstname,
                          lastname: lastname,
                          email: email
                        },
                      })
                    }
                  }
                )
              }
            })
          }
        }
      }
    )
  } catch (err) {
    console.error("Error storing user in the database: ", err)
    res.sendStatus(500)
  }
}

// Login function
function login(req, res) {

  const { email, password } = req.body

  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          if (results.length > 0) {
            // Compare the password with the hash
            bcrypt.compare(password, results[0].password, function (
              err,
              result
            ) {
              if (err) {
                res.json({ status: "error", message: err })
                return
              } else {
                if (result) {
                  // Generate JWT token for the registered user
                  const token = jwt.sign({ email }, process.env.JWT_SECRET)

                  res.json({
                    status: "ok",
                    message: "User logged in successfully",
                    token: token,
                    user: {
                      id: results[0].id,
                      firstname: results[0].firstname,
                      lastname: results[0].lastname,
                      email: results[0].email
                    },
                  })
                } else {
                  res.json({
                    status: "error",
                    message: "Email and password does not match",
                  })
                  return
                }
              }
            })
          } else {
            res.json({ status: "error", message: "Email does not exists" })
            return
          }
        }
      })
  } catch (err) {
    console.error("Error querying the database: ", err)
    res.sendStatus(500)
  }
      
}

module.exports = {
  register,
  login,
}
