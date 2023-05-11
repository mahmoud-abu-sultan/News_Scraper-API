const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

//---
const getMainNewsInfo = async () => {
  const htmlContent = await request.get(
    "https://www.beinsports.com/en/football/"
  );
  if (htmlContent) {
    const $ = cheerio.load(htmlContent);

    //page_title -> main_categorie
    const mainCategorie = $(".page_title a").text().trim();
    // console.log(mainCategorie);

    //caption -> sub_categorie
    const captionArray = [];
    $(".main_article__txt .caption span").each((i, el) => {
      captionArray.push($(el).text().trim());
      // console.log($(el).text());
    });

    //img_link
    const imgLinkArray = [];
    $(".cluster__article_visuel img").each((i, el) => {
      imgLinkArray.push($(el).attr("data-src"));
      // console.log($(el).attr("data-src"));
    });

    //has_video
    let has_video = [];
    $(".cluster__article_visuel span").each((i, el) => {
      if ($(".cluster__article_visuel span").html() != undefined) {
        has_video.push(true);
      }
      has_video.push(false);
    });

    //highlights
    const highlightsArray = [];
    $(".main_article__txt .cluster-Latest__title1 a").each((i, el) => {
      highlightsArray.push($(el).text().trim());
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
      descriptionArray.push($(el).text().trim());
      // console.log($(el).text());
    });

    const readFileJson = fs.readFileSync("glopalData.json", "utf8");
    const dataJson = await JSON.parse(readFileJson);
    const dataLingth = dataJson.length;

    for (let index = 0; index < captionArray.length; index++) {
      const testFind = dataJson.find(
        (ele) => ele.highlights == highlightsArray[index]
      );

      if (testFind == undefined) {
        const newObj = {
          id: `6900${dataLingth + index}`,
          main_categorie: mainCategorie,
          sub_categorie: captionArray[index],
          img_link: imgLinkArray[index],
          has_video: has_video[index],
          highlights: highlightsArray[index],
          descriptionLink: descriptionLinkArray[index],
          description: descriptionArray[index],
        };

        dataJson.push(newObj);
      }
    }

    await fs.writeFileSync("glopalData.json", JSON.stringify(dataJson));
  } else {
    throw new error({
      message: "Error in Internet conniction - TitleCardNews",
    });
  }
};

module.exports = getMainNewsInfo;

// getMainNewsInfo()
//   .then(() => {
//     console.log("OK: 200 - TitleCardNews");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
