const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const getDescNewsinfo = async () => {
  const main_categorie = "Motorsports"; //--- get from json us front
  // Football Tennis Basketball Cricket Motorsports NBA

  const descriptionLink = //I--- get from json us front
    //test // "https://www.beinsports.com/en/uefa-europa-league/video/gatti-snatches-juve-late-draw-against-sevilla/2088789";//f v
    //test // "https://www.beinsports.com/en/tennis/news/tsitsipas-wins-after-long-wait-in-miami/2062412";//t i
    //test // "https://www.beinsports.com/en/nba/video/nba-round-up-lakers-crush-grizzlies-to-advanc/2079721"; //n v
    "https://www.beinsports.com/en/f1/news/red-bulls-perez-wins-azerbaijan-grand-prix-sp/2079909"; //m I

  const htmlContent = await request.get(descriptionLink);
  // ---
  const readFileJson = fs.readFileSync(
    `./data/${main_categorie}Data.json`,
    "utf8"
  );
  const dataJson = await JSON.parse(readFileJson);

  const hasVideo = false; /*dataJson.find(
    (ele) => ele.descriptionLink === descriptionLink
  ).has_video;*/

  if (htmlContent) {
    const $ = cheerio.load(htmlContent);

    //// titles
    const selector_titles = () => {
      if (hasVideo) {
        return ".video h1";
      } else {
        return "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > header > h1";
      }
    };
    const title = $(`${selector_titles()}`).text().trim();

    //// datePublished
    const datePublished = $(".main_article__author time").text().trim();

    //// video_link
    const videoLink = $("#f198c86f9f22bf4").attr("src");

    //// article_body
    const selector_article_body = () => {
      if (hasVideo) {
        return "#main_gallery > div > div > div > div > article > section > div:nth-child(1)";
      } else {
        return "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > div.plrm > section > div:nth-child(1)";
      }
    };
    const articleBody = $(`./data/${selector_article_body()}`).text().trim();

    // --- ---
    const idOpj = "69001";
    const thisOpj = dataJson.find((ele) => ele.id == idOpj);

    if (thisOpj != undefined) {
      thisOpj.title = title;
      thisOpj.datePublished = datePublished;
      thisOpj.videoLink = videoLink;
      thisOpj.articleBody = articleBody;

      await fs.writeFileSync(
        `${main_categorie}Data.json`,
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
