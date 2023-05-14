const footballScrap = require("./modules/BeinSports_Scraping");

// --- footballScrap ---
const handlingScrap = async () => {
  await footballScrap
    .titleCardNews()
    .then(() => {
      console.log("OK: 200 - TitleCardNews");
    })
    .catch((err) => {
      console.log(err.message);
    });

  await footballScrap
    .descCarsNews()
    .then(() => {
      console.log("OK: 200 - DescCarsNews");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

handlingScrap()
  .then(() => {
    console.log("OK: 200 - App");
  })
  .catch((err) => {
    console.log(err.message);
  });
// --------------------------
