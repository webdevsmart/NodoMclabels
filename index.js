const axios = require("axios");
const fs = require("fs");
const { Parser } = require("json2csv");
const json2csvParser = new Parser();

let products = [];
let flag = true;
let i = 1;
async function getProducts() {
  while (flag) {
    await axios
      .get("http://nodo.mclabels.com/export_prods/0", {
        params: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac2hvY2xlZmNvcnBvcmF0aW9uLmNvbSJ9.Uyn0FgRwtYZH-cOEcs1e4emP55xkDag2ZetAXa_ok9U",
          page: i,
        },
      })
      .then(async (res) => {
        if (res.data.length != 0) {
          await res.data.map((item, key) => {
            products.push(item);
          });
          console.log("done : ", i);
          i++;
          if (i % 50 == 0) {
            await PushCsv(i);
            products = [];
          }
        } else {
          flag = false;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  }
  PushCsv(i);
}

async function PushCsv(fileIndex) {
  //  const jsonString = JSON.stringify(products);
  const csv = json2csvParser.parse(products);

  await fs.writeFile(`./newProducts${fileIndex}.csv`, csv, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file", fileIndex);
    }
  });
}

getProducts();
