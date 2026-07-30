"use server";
import sharp from "sharp";

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export async function placeholderFromBuffer(buffer: Buffer): Promise<string> {
  try {
    const resizedBuffer = await sharp(buffer).resize(20).toBuffer();
    return bufferToBase64(resizedBuffer);
  } catch (error) {
    console.error("Error generating placeholder from buffer:", error);
    // Return a default placeholder on error
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";
  }
}
