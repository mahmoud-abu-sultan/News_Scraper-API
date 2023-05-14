const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

//---
const getMainNewsInfo = async () => {
  const categorie = "Motorsports"; //--- get from 'front'
  // Football Tennis Basketball Cricket Motorsports NBA

  const htmlContent = await request.get(
    `https://www.beinsports.com/en/${categorie}/`
  );
  if (htmlContent) {
    const $ = cheerio.load(htmlContent);

    //// page_title -> main_categorie
    const mainCategorie = $(".page_title a").text().trim();

    //// caption -> sub_categorie
    const captionArray = [];
    $(".main_article__txt .caption span").each((i, el) => {
      captionArray.push($(el).text().trim());
    });

    //// img_link
    const imgLinkArray = [];
    $(".cluster__article_visuel img").each((i, el) => {
      imgLinkArray.push($(el).attr("data-src"));
    });

    //// has_video
    let has_video = [];
    $(".cluster__article_visuel span").each((i, el) => {
      if ($(el).html != undefined) {
        has_video.push(true);
      }
      has_video.push(false);
    });

    //// highlights
    const highlightsArray = [];
    $(".main_article__txt .cluster-Latest__title1 a").each((i, el) => {
      highlightsArray.push($(el).text().trim());
    });

    //// descriptionLink
    const descriptionLinkArray = [];
    $(".cluster-Latest__title1 a").each((i, el) => {
      descriptionLinkArray.push(
        "https://www.beinsports.com" + $(el).attr("href")
      );
    });

    //// description
    const descriptionArray = [];
    $(".main_article__txt p").each((i, el) => {
      descriptionArray.push($(el).text().trim());
    });

    // --- --- --- --- --- ---
    const readFileJson = fs.readFileSync(
      `./data/${categorie}Data.json`,
      "utf8"
    );
    const dataJson = await JSON.parse(readFileJson);

    const dataLingth = dataJson.length;

    for (let index = 1; index <= captionArray.length; index++) {
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

    fs.writeFileSync(`./data/${categorie}Data.json`, JSON.stringify(dataJson));
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
