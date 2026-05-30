import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  const { html, title } = await req.json();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #333; line-height: 1.6; }
    h1 { font-size: 22px; border-bottom: 2px solid #8b1a1a; padding-bottom: 8px; }
    h2 { font-size: 16px; color: #8b1a1a; margin-top: 24px; }
    .support { background: rgba(76,150,80,0.12); padding: 1px 3px; border-radius: 2px; color: #2d6a30; }
    .flag { background: rgba(200,50,50,0.12); padding: 1px 3px; border-radius: 2px; color: #8b2020; }
    .citation { font-size: 13px; color: #666; border-left: 3px solid #8b1a1a; padding-left: 10px; margin: 8px 0; }
    .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 11px; color: #999; }
  </style>
</head>
<body>${html}</body>
</html>`;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    margin: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
    printBackground: true,
  });

  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title || "steelman-report"}.pdf"`,
    },
  });
}
