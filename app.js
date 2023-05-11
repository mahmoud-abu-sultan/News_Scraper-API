const footballScrap = require("./modules/BeinSports/footballScraping");
const fs = require("fs");

footballScrap
  .titleCardNews()
  .then(() => {
    console.log("OK: 200 - TitleCardNews");
  })
  .catch((err) => {
    console.log(err.message);
  });

console.log("welcom in app.js");
// footballScrap.descCarsNews();
