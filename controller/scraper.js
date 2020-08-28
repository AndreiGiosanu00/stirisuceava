const request = require("request");
const cheerio = require("cheerio");

const Article = require("../models/Article.js");

exports.getStiriSuceavaNetNews = function() {
    request("https://www.stirisuceava.net/", function(error, response, html) {
        try {
            const $ = cheerio.load(html);
            let linksArray = [];

            $(".post-outer").each(function(i, element) {
                let result = {};

                result.title = $(this)
                    .children("div")
                    .children("article")
                    .children("font")
                    .children("h2")
                    .children("a")
                    .text();

                result.link = $(this)
                    .children("div")
                    .children("article")
                    .children("font")
                    .children("h2")
                    .children("a")
                    .attr("href");

                result.imgSrc = $(this)
                    .children("div")
                    .children("div")
                    .children("div")
                    .children("a")
                    .attr('style');
                result.imgSrc = result.imgSrc
                    .replace('url(','').replace(')','')
                    .replace(' no-repeat center center;background-size:cover', '')
                    .replace('background:', '')
                    .replace('s72', 's1600')
                    .replace('default', 'mqdefault');

                result.date = $(this)
                    .children("div")
                    .children("article")
                    .children("div")
                    .children("div")
                    .children("a")
                    .children("abbr")
                    .text();

                result.preview = $(this)
                    .children("div")
                    .children("article")
                    .children("div")
                    .children("div").eq(1)
                    .children("span")
                    .text();

                result.source = '<a href="https://www.stirisuceava.net/" target="_blank">stirisuceava.net</a>';

                populateDataBase(result, linksArray);
            });
        } catch (e) {
            console.log(e);
        }
    });
};

exports.getMonitorulSuceavaNews = async function() {
    request("https://www.monitorulsv.ro/", function(error, response, html) {
        try {
            const $ = cheerio.load(html);
            let linksArray = [];

            $(".articol").each(function(i, element) {
                if (!$(this).parent().parent().parent("li").length && !$(this).parent().parent('center').length) {
                    let result = {};

                    result.title = $(this).text();

                    result.link = 'https://www.monitorulsv.ro' + $(this).attr("href");

                    result.imgSrc = $(this).parent().children('a').children('img').attr('src');

                    result.preview = $(this).parent().next().children('a').text();

                    result.source = '<a href="https://www.monitorulsv.ro/" target="_blank">monitorulsv.ro</a>';

                    if (!result.preview) { // first article
                        result.imgSrc = $(this).parent().next().children('img').attr('src');
                        result.preview = $(this).parent().next().next().children('a').text();
                        result.link = $(this).attr("href");
                    }

                    if (!result.imgSrc) {
                        result.imgSrc = "./assets/logo.png";
                    }

                    const months = ["ianuarie", "februarie", "martie","aprilie", "mai", "iunie", "iulie", "august", "septembrie",
                        "octombrie", "noiembrie", "decembrie"];
                    let current_datetime = new Date();
                    result.date = months[current_datetime.getMonth()] + " " + current_datetime.getDate() + ", " + current_datetime.getFullYear();

                    populateDataBase(result, linksArray);
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
};

exports.getNewsBucovinaNews = async function() {
    request("https://www.newsbucovina.ro/actualitate/", function(error, response, html) {
        try {
            const $ = cheerio.load(html);
            let linksArray = [];

            $(".td-block-span6").each(function(i, element) {
                let result = {};

                result.title = "News Bucovina - Actualitate";

                result.preview = $(this)
                    .children("div")
                    .children("div")
                    .children("div")
                    .children("a")
                    .attr("title");

                result.link = $(this)
                    .children("div")
                    .children("div")
                    .children("div")
                    .children("a")
                    .attr("href");

                result.imgSrc = $(this)
                    .children("div")
                    .children("div")
                    .children("div")
                    .children("a")
                    .children("img")
                    .attr("src");

                result.date = $(this)
                    .children("div")
                    .children("div")
                    .next()
                    .next()
                    .children("span")
                    .children("time")
                    .text();

                result.source = '<a href="https://www.newsbucovina.ro/" target="_blank">newsbucovina.ro</a>';

                populateDataBase(result, linksArray);
            });
        } catch (e) {
            console.log(e);
        }
    });
};

function populateDataBase(result, linksArray) {
    request(result.link, function(error, response, html) {
        result.link += '/';
        try {
            const $ = cheerio.load(html);
            // monitorul SV
            if (result.link.includes("monitorulsv")) {
                result.content = $("#corpArticol").children("p").text();
            }

            // stiri suceava NET
            if (result.link.includes("stirisuceava")) {
                result.content = $("article>div.post-body").text();
            }

            // news bucovina
            if (result.link.includes("newsbucovina")) {
                result.content = $("article>div.td-post-content").children("p").text();
            }

            if (result.title !== "" && result.link !== "") {
                if (linksArray.indexOf(result.link) == -1) {
                    linksArray.push(result.link);

                    Article.count({ link: result.link }, function(err, test) {
                        if (test === 0 && result.preview && result.content) {
                            const entry = new Article(result);

                            entry.save(function(err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                } else {
                    console.log("Article already exists.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            }
        } catch (e) {
            console.log(e);
        }
    });
}
