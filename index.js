const axios = require("axios");
const fs = require("fs");

let products = [];
async function getProducts(page) {
  for (let i = 1; i < 250; i++) {
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
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  }
}

async function PushCsv() {
  await getProducts();
  const jsonString = JSON.stringify(products);
  await fs.writeFile("./newProducts.json", jsonString, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
}

PushCsv();
