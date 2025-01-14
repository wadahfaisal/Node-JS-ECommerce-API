const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");

const getCategoryStats = async (req, res) => {
  const products = await Product.find();
  const categoriesCount = Object.values(
    products.reduce((acc, product) => {
      const { category, inventory, price } = product;
      if (!acc[category]) {
        acc[category] = {
          category,
          numOfProducts: 0,
          inventorySize: 0,
          totalValue: 0,
        };
      }
      acc[category].numOfProducts++;
      acc[category].inventorySize += inventory;
      acc[category].totalValue += price;
      return acc;
    }, {})
  );

  categoriesStats = categoriesCount.map((category) => ({
    ...category,
    averageValue: Number(
      (category.totalValue / category.numOfProducts).toFixed(2)
    ),
  }));

  res.status(StatusCodes.OK).json({ categoriesStats });
};

const getCompanyStats = async (req, res) => {
  const products = await Product.find();

  const companies = Object.values(
    products.reduce((acc, product) => {
      const { company } = product;

      if (!acc[company]) {
        acc[company] = { company, count: 0 };
      }
      acc[company].count++;
      return acc;
    }, {})
  );

  res.status(StatusCodes.OK).json({ companiesStats: companies });
};

module.exports = {
  getCategoryStats,
  getCompanyStats,
};
