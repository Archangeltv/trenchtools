import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address")?.trim();
  const projectName = searchParams.get("name")?.trim() || "token";
  const download = searchParams.get("download") === "1";

  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid contract address provided" },
      { status: 400 },
    );
  }

  const cleanName =
    projectName
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "") || "holders";

  const filename = `trenchtoolscsv_${cleanName}.csv`;

  try {
    const url = `https://robinhoodchain.blockscout.com/api/v2/tokens/${address}/holders/csv`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: "https://robinhoodchain.blockscout.com/",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Blockscout returned status ${response.status}` },
        { status: response.status },
      );
    }

    const csvText = await response.text();

    if (download) {
      return new NextResponse(csvText, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      filename,
      csv: csvText,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch holders from Blockscout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
