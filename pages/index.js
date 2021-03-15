import { Line } from "react-chartjs-2";
import React from "react";

import useSWR from "swr";

function Home() {
  return (
    <>
      <h1>Moment link:</h1>
      <input></input>
      <button>Go!</button>
      <Graph></Graph>
    </>
  );
}

function Graph() {
  var { data, error } = useSWR("/api/moment", (url) =>
    fetch(url).then((r) => r.json())
  );
  if (error) return "error";
  if (!data) {
    return "Loading";
  }
  if (data) {
    console.log(data);
    return <Line data={data.data} options={{ spanGaps: true }} />;
  }
}

// export async function getServerSideProps() {
//   var URL =
//     "https://www.nbatopshot.com/listings/p2p/208ae30a-a4fe-42d4-9e51-e6fd1ad2a7a9+2deb04a3-0f57-4a37-a810-92959b76ce4a/";
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1280, height: 800 });
//   await page.goto(URL);

//   const data = await page.waitForSelector("#moment-detailed-serialNumber");

//   const heading1 = await page.$eval("#moment-detailed-serialNumber", (el) => {
//     return el.textContent;
//   });

//   var list = new Multimap();
//   heading1.split("#").forEach((val) => {
//     var serial = val.split("-")[0].trim();
//     var price = val.split("-")[1].replace("$", "").replace(",", "").trim();
//     if (price != "") {
//       list.set(parseInt(price), serial);
//     }
//   });

//   list.delete("");

//   var keys = Array.from(list.keys());
//   keys = keys.sort((a, b) => a - b);

//   var chartDataList = [];

//   list.forEachEntry((val, price) => {
//     var min = Math.min(...val);
//     chartDataList.push({ x: price, y: min });
//   });

//   chartDataList.sort((a, b) => a.x - b.x);

//   var lowestSerial = chartDataList[0].y;
//   var finalList = [];
//   chartDataList.forEach((val) => {
//     if (val.y < lowestSerial) {
//       finalList.push(val);
//       lowestSerial = val.y;
//     }
//   });

//   var configuration = {
//     type: "line",
//     data: {
//       datasets: [
//         {
//           label: "Moment prices",
//           data: finalList,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         xAxes: [
//           {
//             type: "linear",
//             position: "bottom",
//           },
//         ],
//       },
//     },
//   };

//   return { props: { configuration } };
// }

export default Home;
