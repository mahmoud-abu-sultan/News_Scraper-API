const request = require("request-promise");
const cheerio = require("cheerio");

const dataJsonFile = require("./glopalData.json");

const getDescNewsinfo = async () => {
  const htmlContent = await request.get(
    "https://www.beinsports.com/en/premier-league/video/brighton-beat-man-utd-to-avenge-fa-cup-defeat/2084127"
  );

  if (htmlContent) {
    const $ = cheerio.load(htmlContent);
    // //highlights
    // const highlights = $(".video h1").text().trim();
    // // console.log(highlights);

    // //datePublished
    // const datePublished = $(".main_article__author time").text().trim();
    // console.log(datePublished);

    // //video_link
    // const videoLink = $("#f198c86f9f22bf4").attr("src");
    // console.log(videoLink);

    // //article_body
    // const articleBody = $(
    //   "#main_gallery > div > div > div > div > article > section > div:nth-child(1)"
    // )
    //   .text()
    //   .trim();
    // console.log(articleBody);
  } else {
    throw new console.error({
      message: "Error in Internet conniction - DescCarsNews",
    });
  }
};

getDescNewsinfo()
  .then((data) => {
    console.log("OK: 200 - DescCarsNews");
  })
  .catch((err) => {
    console.log(err.message);
  });
