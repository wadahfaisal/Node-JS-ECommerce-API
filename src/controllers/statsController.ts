import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { IProduct, Product } from "../models/Product";

interface Acc1 {
  [key: string]: {
    numOfProducts: number;
    inventorySize: number;
    totalValue: number;
    category: string;
  };
}
interface Acc2 {
  [key: string]: {
    company: string;
    count: number;
  };
}

export const getCategoryStats = async (req: Request, res: Response) => {
  const products = await Product.find();
  const categoriesCount = Object.values(
    products.reduce((acc: Acc1, product: IProduct) => {
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

  const categoriesStats = categoriesCount.map((category) => ({
    ...category,
    averageValue: Number(
      (category.totalValue / category.numOfProducts).toFixed(2)
    ),
  }));

  res.status(StatusCodes.OK).json({ categoriesStats });
};

export const getCompanyStats = async (req: Request, res: Response) => {
  const products = await Product.find();

  const companies = Object.values(
    products.reduce((acc: Acc2, product) => {
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
