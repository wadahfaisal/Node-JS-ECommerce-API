"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyStats = exports.getCategoryStats = void 0;
const http_status_codes_1 = require("http-status-codes");
const Product_1 = require("../models/Product");
const getCategoryStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find();
    const categoriesCount = Object.values(products.reduce((acc, product) => {
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
    }, {}));
    const categoriesStats = categoriesCount.map((category) => (Object.assign(Object.assign({}, category), { averageValue: Number((category.totalValue / category.numOfProducts).toFixed(2)) })));
    res.status(http_status_codes_1.StatusCodes.OK).json({ categoriesStats });
});
exports.getCategoryStats = getCategoryStats;
const getCompanyStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find();
    const companies = Object.values(products.reduce((acc, product) => {
        const { company } = product;
        if (!acc[company]) {
            acc[company] = { company, count: 0 };
        }
        acc[company].count++;
        return acc;
    }, {}));
    res.status(http_status_codes_1.StatusCodes.OK).json({ companiesStats: companies });
});
exports.getCompanyStats = getCompanyStats;
