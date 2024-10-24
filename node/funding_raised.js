const parseCsvSync = require("csv-parse/lib/sync");
const fs = require("fs");
const path = require("path");

const ROW_MATRIX = {
  permalink: 0,
  company_name: 1,
  number_employees: 2,
  category: 3,
  city: 4,
  state: 5,
  funded_date: 6,
  raised_amount: 7,
  raised_currency: 8,
  round: 9,
};

class FundingRaised {
  static loadCSVData(file) {
    const filePath = path.join(__dirname, "..", file);
    const fileData = fs.readFileSync(filePath).toString();
    return parseCsvSync(fileData);
  }

  static mapRowToObject(row) {
    return {
      permalink: row[ROW_MATRIX.permalink],
      company_name: row[ROW_MATRIX.company_name],
      number_employees: row[ROW_MATRIX.number_employees],
      category: row[ROW_MATRIX.category],
      city: row[ROW_MATRIX.city],
      state: row[ROW_MATRIX.state],
      funded_date: row[ROW_MATRIX.funded_date],
      raised_amount: row[ROW_MATRIX.raised_amount],
      raised_currency: row[ROW_MATRIX.raised_currency],
      round: row[ROW_MATRIX.round],
    };
  }

  static applyFilters(csvData, options) {
    return csvData.filter((row) => {
      return (
        (!options.company_name ||
          options.company_name === row[ROW_MATRIX.company_name]) &&
        (!options.city || options.city === row[ROW_MATRIX.city]) &&
        (!options.state || options.state === row[ROW_MATRIX.state]) &&
        (!options.round || options.round === row[ROW_MATRIX.round])
      );
    });
  }

  static where(options = {}) {
    const csvData = this.loadCSVData("startup_funding.csv");
    const filteredData = this.applyFilters(csvData, options);

    return filteredData.map(this.mapRowToObject);
  }

  static findBy(options = {}) {
    const csvData = this.loadCSVData("startup_funding.csv");
    const filteredData = this.applyFilters(csvData, options);

    if (filteredData.length > 0) {
      return this.mapRowToObject(filteredData[0]);
    }

    return null;
  }

  static async asyncWhere(options = {}) {
    const csvData = this.loadCSVData("startup_funding.csv");
    const filteredData = this.applyFilters(csvData, options);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filteredData.map(this.mapRowToObject));
      }, 1000);
    });
  }
}

module.exports = FundingRaised;
