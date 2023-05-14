const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const getDescNewsinfo = async () => {
  const htmlContent = await request.get(
    "https://www.beinsports.com/en/premier-league/video/brighton-beat-man-utd-to-avenge-fa-cup-defeat/2084127"
    // "https://www.beinsports.com/en/serie-a/news/napoli-end-33-year-wait-for-serie-a-title/2084096"
  );

  if (htmlContent) {
    const $ = cheerio.load(htmlContent);
    ////title
    ////if video get this path
    const title = $(".video h1").text().trim();

    ////if image get this path
    // const title = $(
    //   "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > header > h1"
    // )
    //   .text()
    //   .trim();

    // console.log(title);

    ////datePublished
    const datePublished = $(".main_article__author time").text().trim();
    // console.log(datePublished);

    ////video_link
    const videoLink = $("#f198c86f9f22bf4").attr("src");
    // console.log(videoLink);

    ////article_body
    const articleBody = $(
      ////if video will get this path
      "#main_gallery > div > div > div > div > article > section > div:nth-child(1)"

      ////if image will get this path
      // "body > section.page-story > div > div > div.block-col.block-flex-2-columns > main > article > div > article > div.plrm > section > div:nth-child(1)"
    )
      .text()
      .trim();
    // console.log(articleBody);

    //---
    const readFileJson = fs.readFileSync("footballData.json", "utf8");
    const dataJson = await JSON.parse(readFileJson);

    const idOpj = "69001";
    const thisOpj = dataJson.find((ele) => ele.id == idOpj);

    if (thisOpj != undefined) {
      thisOpj.title = title;
      thisOpj.datePublished = datePublished;
      thisOpj.videoLink = videoLink;
      thisOpj.articleBody = articleBody;

      await fs.writeFileSync("footballData.json", JSON.stringify(dataJson));
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
