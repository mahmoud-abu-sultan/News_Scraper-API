const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const gitCategoriesType = async () => {
  const htmlContent = await request.get("https://www.beinsports.com/en/");
  if (htmlContent) {
    const $ = cheerio.load(htmlContent);

    // categories Tyep
    const categoriesArray = [];
    $(
      "body > header > div > div.container-center-header > div:nth-child(4) > div.middle-header-cell2 > nav > ul > li"
    ).each((i, el) => {
      if (i <= 5) {
        categoriesArray.push($(el).text().trim());
      }
    });

    // --- --- --- --- --- ---
    const readFileJson = fs.readFileSync("./data/categories.json", "utf8");
    const dataJson = await JSON.parse(readFileJson);

    for (let index = 0; index < categoriesArray.length; index++) {
      const testFind = dataJson.find((ele) => {
        return ele.id == categoriesArray[index].substr(0, 3);
      });

      if (testFind == undefined) {
        const newObj = {
          id: categoriesArray[index].substr(0, 3),
          categorie_name: `${categoriesArray[index]}`,
        };
        dataJson.push(newObj);
      }
    }

    fs.writeFileSync("./data/categories.json", JSON.stringify(dataJson));
  } else {
    throw new error({
      message: "Error in Internet conniction - gitCategoriesType",
    });
  }
};

module.exports = gitCategoriesType;

// gitCategoriesType()
//   .then(() => {
//     console.log("OK: 200 - gitCategoriesType");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
