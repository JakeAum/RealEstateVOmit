import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imageData, accountId, addy } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Missing data', message: 'No image data provided' },
        { status: 400 }
      );
    }

    console.log(`Creating PDF for account ID: ${accountId}`);

    // Process the first image: change red pixels to black
    const firstPageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
    const processedFirstPage = await sharp(firstPageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = processedFirstPage;
    const pixelArray = new Uint8ClampedArray(data);

    for (let i = 0; i < pixelArray.length; i += info.channels) {
      const red = pixelArray[i];
      const green = pixelArray[i + 1];
      const blue = pixelArray[i + 2];

      // Check if the pixel is predominantly red
      if (red > 200 && red > green * 1.5 && red > blue * 1.5) {
        pixelArray[i] = 0;     // Red
        pixelArray[i + 1] = 0; // Green
        pixelArray[i + 2] = 0; // Blue
        // Alpha channel (if exists) remains unchanged
      }
    }

    const processedImageBuffer = await sharp(pixelArray, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
      .png()
      .toBuffer();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add the first page (color-adjusted image)
    const firstPageImage = await pdfDoc.embedPng(processedImageBuffer);
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    page1.drawImage(firstPageImage, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });

    // Add the second page
    const secondPagePath = path.join(process.cwd(), 'public', 'contract_templates', 'contract_page_2.png');
    const secondPageImageBytes = await fs.readFile(secondPagePath);
    const secondPageImage = await pdfDoc.embedPng(secondPageImageBytes);
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    page2.drawImage(secondPageImage, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Return the PDF
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${addy}_${accountId}.pdf`,
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}