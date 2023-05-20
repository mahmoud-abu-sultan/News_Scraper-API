const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const getDescNewsinfo = async () => {
  const main_categorie = "Football"; //--- get from json us front
  //---
  const readFileJson = fs.readFileSync(
    `./data/${main_categorie}Data.json`,
    "utf8"
  );
  const dataJson = await JSON.parse(readFileJson);
  //---
  const idOpj = "69001";
  const thisOpj = dataJson.find((ele) => ele.id == idOpj);
  //---
  const descriptionLink = thisOpj.descriptionLink; //I--- get from json us front

  // ---
  const htmlContent = await request.get(descriptionLink);

  if (htmlContent) {
    const $ = cheerio.load(htmlContent);
    // video_link
    const videoLink = $("#dailymotion-player-embed > div > iframe").attr("src");

    // // titles
    // const title = $(".video h1").text().trim();

    // // article_body
    // const articleBody = $(
    //   "#main_gallery > div > div > div > div > article > section > div:nth-child(1)"
    // )
    //   .text()
    //   .trim();

    // titles
    const title = $(
      "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > header > h1"
    )
      .text()
      .trim();
    // article_body
    const articleBody = $(
      "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > div.plrm > section > div:nth-child(1)"
    )
      .text()
      .trim();

    // datePublished
    const datePublished = $(".main_article__author time").text().trim();
    // --- ---
    if (thisOpj != undefined) {
      if (thisOpj.title == "") {
        thisOpj.title = title;
        thisOpj.articleBody = articleBody;
      }
      thisOpj.videoLink = videoLink;
      thisOpj.datePublished = datePublished;

      await fs.writeFileSync(
        `./data/${main_categorie}Data.json`,
        JSON.stringify(dataJson)
      );
    }
  } else {
    throw new console.error({
      message: "Error in Internet conniction - DescCarsNews",
    });
  }
};

module.exports = getDescNewsinfo;

// getDescNewsinfo()
//   .then((data) => {
//     console.log("OK: 200 - DescCarsNews");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
