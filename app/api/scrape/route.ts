import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parcelId = body.parcelId;

    if (!parcelId) {
      return NextResponse.json({ error: "Parcel ID is required" }, { status: 400 });
    }
    const url = `https://www.ccappraiser.com/Show_parcel.asp?acct=${parcelId}&gen=T&tax=T&bld=T&oth=T&sal=T&lnd=T&leg=T`;

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const extractData = (selector: string): string[] => {
      return $(selector)
        .next("div")
        .text()
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    };

    const ownerData = extractData("h2:contains('Owner:')");
    const propertyData = extractData("h2:contains('Property Location:')");
    const legalData = extractData("h2:contains('Legal Description:')");

    const result = {
      ownerInformation: ownerData,
      propertyInformation: propertyData,
      legalInformation: legalData,
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}