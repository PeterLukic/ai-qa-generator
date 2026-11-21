export type DomChunk = {
  id: string;
  documentIndex: number;
  content: string;
  length: number;
};

export const DEFAULT_MAX_CHUNK_SIZE =
  12000;

// =====================================================
// NORMALIZE HTML
// =====================================================

function normalizeHtml(
  html: string
): string {
  return html
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// SPLIT CONCATENATED HTML DOCUMENTS
// =====================================================

function splitHtmlDocuments(
  html: string
): string[] {
  const matches = [
    ...html.matchAll(
      /<html\b/gi
    ),
  ];

  if (
    matches.length <= 1
  ) {
    return [
      html,
    ];
  }

  const documents:
    string[] = [];

  for (
    let index = 0;
    index < matches.length;
    index++
  ) {
    const start =
      matches[index].index ??
      0;

    const end =
      index <
      matches.length - 1
        ? matches[
            index + 1
          ].index
        : html.length;

    if (
      end === undefined
    ) {
      continue;
    }

    const document =
      html
        .slice(
          start,
          end
        )
        .trim();

    if (document) {
      documents.push(
        document
      );
    }
  }

  return documents;
}

// =====================================================
// FALLBACK SPLITTER
// =====================================================

function splitLargeString(
  html: string,
  maxChars: number
): string[] {
  const chunks:
    string[] = [];

  let remaining =
    html.trim();

  while (
    remaining.length >
    maxChars
  ) {
    let cutPosition =
      remaining.lastIndexOf(
        ">",
        maxChars
      );

    // Avoid creating an extremely tiny
    // chunk if no useful HTML boundary
    // was found.
    if (
      cutPosition <
      maxChars * 0.5
    ) {
      cutPosition =
        maxChars;
    } else {
      cutPosition += 1;
    }

    const chunk =
      remaining
        .slice(
          0,
          cutPosition
        )
        .trim();

    if (chunk) {
      chunks.push(
        chunk
      );
    }

    remaining =
      remaining
        .slice(
          cutPosition
        )
        .trim();
  }

  if (remaining) {
    chunks.push(
      remaining
    );
  }

  return chunks;
}

// =====================================================
// SPLIT LARGE ELEMENT RECURSIVELY
// =====================================================

function splitElement(
  element: Element,
  maxChars: number
): string[] {
  const elementHtml =
    normalizeHtml(
      element.outerHTML
    );

  // Element already fits.
  if (
    elementHtml.length <=
    maxChars
  ) {
    return [
      elementHtml,
    ];
  }

  const children =
    Array.from(
      element.children
    );

  // Giant element with no child elements.
  // Use safe fallback splitting.
  if (
    children.length === 0
  ) {
    return splitLargeString(
      elementHtml,
      maxChars
    );
  }

  const result:
    string[] = [];

  let buffer = "";

  const flushBuffer =
    () => {
      const normalized =
        normalizeHtml(
          buffer
        );

      if (normalized) {
        result.push(
          normalized
        );
      }

      buffer = "";
    };

  for (
    const child of children
  ) {
    const childHtml =
      normalizeHtml(
        child.outerHTML
      );

    // Child itself is too large.
    // Recurse deeper.
    if (
      childHtml.length >
      maxChars
    ) {
      flushBuffer();

      const childChunks =
        splitElement(
          child,
          maxChars
        );

      result.push(
        ...childChunks
      );

      continue;
    }

    // Adding the child would make
    // the current semantic chunk too large.
    if (
      buffer &&
      buffer.length +
        childHtml.length >
        maxChars
    ) {
      flushBuffer();
    }

    buffer +=
      childHtml;
  }

  flushBuffer();

  // Safety fallback.
  if (
    result.length === 0
  ) {
    return splitLargeString(
      elementHtml,
      maxChars
    );
  }

  return result;
}

// =====================================================
// CHUNK ONE HTML DOCUMENT
// =====================================================

function chunkSingleDocument(
  html: string,
  maxChars: number
): string[] {
  const normalized =
    normalizeHtml(
      html
    );

  if (
    normalized.length <=
    maxChars
  ) {
    return [
      normalized,
    ];
  }

  const parser =
    new DOMParser();

  const document =
    parser.parseFromString(
      normalized,
      "text/html"
    );

  const body =
    document.body;

  const topLevelElements =
    Array.from(
      body.children
    );

  if (
    topLevelElements.length ===
    0
  ) {
    return splitLargeString(
      normalized,
      maxChars
    );
  }

  const chunks:
    string[] = [];

  let buffer = "";

  const flushBuffer =
    () => {
      const cleaned =
        normalizeHtml(
          buffer
        );

      if (cleaned) {
        chunks.push(
          cleaned
        );
      }

      buffer = "";
    };

  for (
    const element of
    topLevelElements
  ) {
    const html =
      normalizeHtml(
        element.outerHTML
      );

    // Large top-level module:
    // recursively inspect its structure.
    if (
      html.length >
      maxChars
    ) {
      flushBuffer();

      chunks.push(
        ...splitElement(
          element,
          maxChars
        )
      );

      continue;
    }

    if (
      buffer &&
      buffer.length +
        html.length >
        maxChars
    ) {
      flushBuffer();
    }

    buffer += html;
  }

  flushBuffer();

  return chunks;
}

// =====================================================
// PUBLIC CHUNKER
// =====================================================

export function chunkDom(
  html: string,
  maxChars: number =
    DEFAULT_MAX_CHUNK_SIZE
): DomChunk[] {

  if (!html.trim()) {
    return [];
  }

  const documents =
    splitHtmlDocuments(
      html
    );

  const chunks:
    DomChunk[] = [];

  let chunkCounter = 1;

  documents.forEach(
    (
      document,
      documentIndex
    ) => {

      const documentChunks =
        chunkSingleDocument(
          document,
          maxChars
        );

      documentChunks.forEach(
        (
          content
        ) => {

          chunks.push({
            id:
              `CHUNK_${String(
                chunkCounter
              ).padStart(
                3,
                "0"
              )}`,

            documentIndex:
              documentIndex +
              1,

            content,

            length:
              content.length,
          });

          chunkCounter++;
        }
      );
    }
  );

  return chunks;
}