const request = require("request-promise");
const cheerio = require("cheerio");

//---
const getHtmlContent = async () => {
  const htmlContent = await request.get(
    "https://www.beinsports.com/en/football/"
  );
  if (htmlContent) {
    const $ = cheerio.load(htmlContent);
    ////title img news
    // $(".cluster__article_visuel img").each((i, el) => {
    //   console.log($(el).attr("data-src"));
    // });

    ////link discription news
    // $(".main_article__txt a").each((i, el) => {
    //   console.log("https://www.beinsports.com" + $(el).attr("href"));
    // });

    $(".main_article__txt a").each((i, el) => {
      console.log("https://www.beinsports.com" + $(el).attr("href"));
    });
  } else {
    throw new error({ message: "Error in Internet conniction" });
  }
};

getHtmlContent()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err.message);
  });
