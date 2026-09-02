import QRCode from "qrcode";
import { writeFileSync } from "fs";

const wechatUrl = "http://weixin.qq.com/r/mp/IBFhedzEiIH3rZga90Qy";

async function generate() {
  const svg = await QRCode.toString(wechatUrl, {
    type: "svg",
    color: {
      // DoggyArium ink on paper — high contrast for scanning; brand gold is for chrome only
      dark: "#19150f",
      light: "#f5f0e6",
    },
    margin: 2,
    width: 256,
  });

  writeFileSync("public/qr-wechat.svg", svg, "utf-8");
  console.log("Generated public/qr-wechat.svg");
}

generate();
