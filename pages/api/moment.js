// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const puppeteer = require("puppeteer");
var Multimap = require("multimap");

export default async (req, res) => {
  var URL =
    "https://www.nbatopshot.com/listings/p2p/208ae30a-a4fe-42d4-9e51-e6fd1ad2a7a9+2deb04a3-0f57-4a37-a810-92959b76ce4a/";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(URL);

  const data = await page.waitForSelector("#moment-detailed-serialNumber");

  const heading1 = await page.$eval("#moment-detailed-serialNumber", (el) => {
    return el.textContent;
  });

  var list = new Multimap();
  heading1.split("#").forEach((val) => {
    var serial = val.split("-")[0].trim();
    var price = val.split("-")[1].replace("$", "").replace(",", "").trim();
    if (price != "") {
      list.set(parseInt(price), serial);
    }
  });

  list.delete("");

  var keys = Array.from(list.keys());
  keys = keys.sort((a, b) => a - b);

  var chartDataList = [];

  list.forEachEntry((val, price) => {
    var min = Math.min(...val);
    chartDataList.push({ x: price, y: min });
  });

  chartDataList.sort((a, b) => a.x - b.x);

  var lowestSerial = chartDataList[0].y;
  var finalList = [];
  chartDataList.forEach((val) => {
    if (val.y < lowestSerial) {
      finalList.push(val);
      lowestSerial = val.y;
    }
  });

  var configuration = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Moment prices",
          data: finalList,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "linear",
            position: "bottom",
          },
        ],
      },
    },
  };

  var data2 = configuration.data.datasets[0].data;
  var minX = data2[0].x;
  var maxX = data2[data2.length - 1].x;
  var range = maxX - minX;

  var labels = new Array(maxX - minX);
  for (var x = minX; x < maxX; x++) {
    labels[x - minX] = "$" + x;
  }

  var datas = {
    labels: labels,
    datasets: [
      {
        label: "Lowest serial",
        data: new Array(maxX - minX),
      },
    ],
  };

  data2.forEach((val) => {
    datas.datasets[0].data[val.x - minX] = val.y;
  });
  configuration.data = datas;
  res.status(200).json(configuration);
};
