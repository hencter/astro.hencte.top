import QRCode from "qrcode";
import { writeFileSync } from "fs";

const wechatUrl = "http://weixin.qq.com/r/mp/IBFhedzEiIH3rZga90Qy";

async function generate() {
  const svg = await QRCode.toString(wechatUrl, {
    type: "svg",
    color: {
      dark: "#0e7490",
      light: "#ffffff",
    },
    margin: 2,
    width: 256,
  });

  writeFileSync("public/qr-wechat.svg", svg, "utf-8");
  console.log("Generated public/qr-wechat.svg");
}

generate();
