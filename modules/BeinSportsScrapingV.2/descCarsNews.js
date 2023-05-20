const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
//---

const getDescNewsinfo = async () => {
  const readFileNews_json = await fs.readFileSync(
    "../../data/news.json",
    "utf8"
  );
  const dataListNews = await JSON.parse(readFileNews_json);

  for (var index in dataListNews) {
    const thisOpj = dataListNews[index];

    const descriptionLink = thisOpj.descriptionLink;
    const htmlContent = await request.get(descriptionLink);
    // ---

    if (htmlContent) {
      const $ = cheerio.load(htmlContent);

      const hasVideo = dataListNews[index].has_video;
      console.log(hasVideo);

      // titles
      const selector_titles = () => {
        if (hasVideo) {
          return ".video h1";
        } else {
          return "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > header > h1";
        }
      };
      const title = $(`${selector_titles()}`).text().trim();

      //// video_link
      const videoLink = $("#f198c86f9f22bf4").attr("src");

      // article_body
      const selector_article_body = () => {
        if (hasVideo) {
          return "#main_gallery > div > div > div > div > article > section > div:nth-child(1)";
        } else {
          return "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > div.plrm > section > div:nth-child(1)";
        }
      };
      const articleBody = $(`${selector_article_body()}`).text().trim();

      // datePublished
      const datePublished = $(".main_article__author time").text().trim();

      // --- ---
      if (thisOpj != undefined) {
        if (thisOpj.title == "" || thisOpj.title == undefined) {
          thisOpj.title = title;
          thisOpj.articleBody = articleBody;
        }
        thisOpj.datePublished = datePublished;
        thisOpj.videoLink = videoLink;

        await fs.writeFileSync(
          "../../data/news.json",
          JSON.stringify(dataListNews)
        );
      }
    } else {
      throw new console.error({
        message: "Error in Internet conniction - DescCarsNews",
      });
    } //end if-condtion for get data for it's categorie
  } //END main loop for all categories
};

module.exports = getDescNewsinfo;

// getDescNewsinfo()
//   .then((data) => {
//     console.log("OK: 200 - DescCarsNews");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
