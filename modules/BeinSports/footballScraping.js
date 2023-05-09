const request = require("request-promise");
const cheerio = require("cheerio");
const dataJson = require("../data.json");
const fs = require("fs");

//---
const getHtmlContent = async () => {
  const htmlContent = await request.get(
    "https://www.beinsports.com/en/football/"
  );
  if (htmlContent) {
    const $ = cheerio.load(htmlContent);

    //page_title -> main_categorie
    const mainCategorie = $(".page_title a").text();
    // console.log(mainCategorie);

    //caption -> sub_categorie
    const captionArray = [];
    $(".main_article__txt .caption span").each((i, el) => {
      captionArray.push($(el).text());
      // console.log($(el).text());
    });

    //img_link
    const imgLinkArray = [];
    $(".cluster__article_visuel img").each((i, el) => {
      imgLinkArray.push($(el).attr("data-src"));
      // console.log($(el).attr("data-src"));
    });
    // //video_link

    //title
    const titleArray = [];
    $(".main_article__txt .cluster-Latest__title1 a").each((i, el) => {
      titleArray.push($(el).text());
      // console.log($(el).text());
    });

    //descriptionLink
    const descriptionLinkArray = [];
    $(".cluster-Latest__title1 a").each((i, el) => {
      descriptionLinkArray.push(
        "https://www.beinsports.com" + $(el).attr("href")
      );
      // console.log("https://www.beinsports.com" + $(el).attr("href"));
    });

    //description
    const descriptionArray = [];
    $(".main_article__txt p").each((i, el) => {
      descriptionArray.push($(el).text());
      // console.log($(el).text());
    });

    // //article_body will get this from --- descriptionLink

    // /*
    const readFileJson = fs.readFileSync("../data.json", "utf8");
    const dataJson = JSON.parse(readFileJson);
    for (let index = 0; index < captionArray.length; index++) {
      const newObj = {
        id: index,
        main_categorie: mainCategorie,
        sub_categorie: captionArray[index],
        img_link: imgLinkArray[index],
        video_link: " ",
        title: titleArray[index],
        descriptionLink: descriptionLinkArray[index],
        description: descriptionArray[index],
        article_body: " ",
      };
      dataJson.push(newObj);
    }

    fs.writeFileSync("../data.json", JSON.stringify(dataJson));
    // */
  } else {
    throw new error({ message: "Error in Internet conniction" });
  }
};

getHtmlContent()
  .then((data) => {
    console.log("OK: 200");
  })
  .catch((err) => {
    console.log(err.message);
  });
