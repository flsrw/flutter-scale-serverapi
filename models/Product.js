class Product {
  constructor(data) {
    this.name = data.name
    this.description = data.description
    this.barcode = data.barcode
    this.image = data.image
    this.stock = data.stock
    this.price = data.price
    this.categoryId = data.categoryId
    this.userId = data.userId
    this.statusId = data.statusId
  }
}

module.exports = Product