const JINA_READER_URL = "https://r.jina.ai";
const JINA_SEARCH_URL = "https://s.jina.ai";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeUrl(url: string): Promise<string> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${JINA_READER_URL}/${url}`, {
        headers: {
          Accept: "text/markdown",
          ...(process.env.JINA_API_KEY && {
            Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Jina scrape failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.text();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Jina scrape attempt ${attempt} failed:`, errorMessage);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(
    `Jina scrape failed after ${MAX_RETRIES} attempts, returning empty`
  );
  return "";
}

export async function searchWeb(query: string): Promise<string> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `${JINA_SEARCH_URL}/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Accept: "text/markdown",
            ...(process.env.JINA_API_KEY && {
              Authorization: `Bearer ${process.env.JINA_API_KEY}`,
            }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Jina search failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Jina search attempt ${attempt} failed:`, errorMessage);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(
    `Jina search failed after ${MAX_RETRIES} attempts, returning empty`
  );
  return "";
}
