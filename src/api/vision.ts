import { ENV } from "@/constants/env";
import { SafeSearchResult } from "@/constants/googleVision";
import { VisionApiResponse } from "@/types/vision";
import { convertBase64 } from "@/utils/utils";

const GOOGLE_VISION_API_URL =
  "https://vision.googleapis.com/v1/images:annotate";

export const checkImageSafety = async (file: File): Promise<string> => {
  try {
    const apiKey = ENV.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) throw new Error("API key not configured");

    const base64 = await convertBase64(file);
    const base64Content = base64.split(",")[1];

    const response = await fetch(`${GOOGLE_VISION_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Content },
            features: [{ type: "SAFE_SEARCH_DETECTION" }],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    const result = data.responses?.[0]
      ?.safeSearchAnnotation as SafeSearchResult;

    if (!result) return "Unable to analyze image";

    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error("Error:", error);
    return "Error analyzing image";
  }
};

export const checkMultipleImagesSafety = async (
  files: File[]
): Promise<string[]> => {
  try {
    const apiKey = ENV.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) throw new Error("API key not configured");

    const requests = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertBase64(file);
        const base64Content = base64.split(",")[1];

        return {
          image: { content: base64Content },
          features: [{ type: "SAFE_SEARCH_DETECTION" }],
        };
      })
    );

    const response = await fetch(`${GOOGLE_VISION_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requests }),
    });

    if (!response.ok) throw new Error("API Error");

    const data: VisionApiResponse = await response.json();

    return data.responses.map((response) => {
      if (response.error) {
        console.error(`Vision API Error: ${response.error.message}`);
        return "Error analyzing image";
      }

      const result = response.safeSearchAnnotation as SafeSearchResult;
      if (!result) return "Unable to analyze image";

      return JSON.stringify(result, null, 2);
    });
  } catch (error) {
    console.error("Error:", error);
    return files.map(() => "Error analyzing image");
  }
};
