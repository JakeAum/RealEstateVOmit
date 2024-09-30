import { NextResponse } from "next/server";
import { createCanvas, loadImage, CanvasRenderingContext2D, registerFont } from "canvas";
import path from "path";
import fs from "fs";

 // Register the DejaVu Sans font
 registerFont(path.join(process.cwd(), 'fonts', 'DejaVuSans.ttf'), { family: 'DejaVu Sans' });

function adjustLongLegalText(
  text: string,
  maxCharsPerLine: number = 76,
  maxLines: number = 2
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;

      if (lines.length === maxLines) {
        break;
      }
    }
  }

  if (currentLine) {
    if (lines.length < maxLines) {
      lines.push(currentLine);
    } else {
      // If we've already hit maxLines, we know we need to abbreviate
      lines[maxLines - 1] = lines[maxLines - 1].trim() + " ...";
    }
  }

  // Check if we've processed all words
  const processedText = lines.join(" ");
  const isComplete =
    text.startsWith(processedText) && text.length === processedText.length;

  // If the text is not complete and we haven't already added the suffix, add it now
  if (!isComplete && !lines[lines.length - 1].endsWith("[Legal ABR]")) {
    lines[lines.length - 1] += " ... [Legal ABR]";
  }

  return lines;
}

function adjustOwnerInfo(ownerInfo: string[]): string[] {
  if (ownerInfo.length > 1 && ownerInfo[1].startsWith("%")) {
    return [ownerInfo[0] + ",  " + ownerInfo[1].slice(1)];
  }
  return ownerInfo;
}

export async function POST(request: Request) {
  console.log("Received POST request");

  try {
    const data = await request.json();
    console.log("Request body:", data);

    const skipIndexes: Record<string, number[]> = {
      propertyInformation: [0], // Skip the first item in propertyInformation
      legalInformation: [0, 2], // Skip the first and third items in legalInformation
    };

    // Pixel coordinates for each field
    const pixelCoordinates = {
      ownerInformation: [{ start: [390, 490] }],
      address: [{ start: [390, 880] }], // Add coordinates for the address
      city: [{ start: [390, 1060] }],
      legalInformation: [{ start: [390, 1174] }, { start: [390, 1210] }],
    };

    // Load the image
    const imagePath = path.join(
      process.cwd(),
      "public",
      "contract_templates",
      "contract_page_1.png"
    );

    if (!fs.existsSync(imagePath)) {
      throw new Error("Template image not found");
    }

    const image = await loadImage(imagePath);

    // Create a canvas
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0);

    // Overlay text on the image
    ctx.font = "26px 'DejaVu Sans'";
    ctx.fillStyle = "red";

    // Draw text for each data point using pixel coordinates
    Object.entries(pixelCoordinates).forEach(([key, coordinates]) => {
      if (key === "address") {
        // Handle address separately
        ctx.fillText(
          data.address,
          coordinates[0].start[0],
          coordinates[0].start[1]
        );
      }
      if (key === "city") {
        // Handle city separately
        ctx.fillText(
          data.city,
          coordinates[0].start[0],
          coordinates[0].start[1]
        );
      } else {
        let textArray = data[key];
        if (Array.isArray(textArray)) {
          if (key === "ownerInformation") {
            textArray = adjustOwnerInfo(textArray);
          }
          let drawIndex = 0;
          textArray.forEach((text: string, index: number) => {
            if (
              !skipIndexes[key]?.includes(index) &&
              coordinates[drawIndex] &&
              typeof text === "string"
            ) {
              if (key === "legalInformation" && index === 3) {
                const adjustedLines = adjustLongLegalText(text);
                adjustedLines.forEach((line, lineIndex) => {
                  ctx.fillText(
                    line,
                    coordinates[drawIndex].start[0],
                    coordinates[drawIndex].start[1] + lineIndex * 26
                  );
                });
              } else {
                ctx.fillText(
                  text,
                  coordinates[drawIndex].start[0],
                  coordinates[drawIndex].start[1]
                );
              }
              drawIndex++;
            }
          });
        }
      }
    });

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Create and return the response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png; charset=utf-8",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}