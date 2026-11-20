import { NextResponse } from "next/server";

const ALLOWED_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
] as const;

function isAllowedModel(model: string): boolean {
  return ALLOWED_MODELS.includes(
    model as (typeof ALLOWED_MODELS)[number]
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      apiKey,
      model,
    } = body;

    // =========================================
    // VALIDATE API KEY
    // =========================================

    if (
      !apiKey ||
      typeof apiKey !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Groq API key is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================
    // VALIDATE MODEL
    // =========================================

    if (
      !model ||
      typeof model !== "string" ||
      !isAllowedModel(model)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Groq model.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Testing Groq connection with model:",
      model
    );

    // NEVER log API key.

    // =========================================
    // GROQ REQUEST
    // =========================================

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: "user",
              content:
                "Reply with only the word OK.",
            },
          ],
        }),
      }
    );

    // =========================================
    // ERROR
    // =========================================

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Groq connection failed:",
        response.status,
        errorText
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid or unauthorized Groq API key.",
          },
          {
            status: response.status,
          }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Groq rate limit reached.",
          },
          {
            status: 429,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            `Groq connection failed (${response.status}).`,
        },
        {
          status: response.status,
        }
      );
    }

    // =========================================
    // SUCCESS
    // =========================================

    const data =
      await response.json();

    return NextResponse.json({
      success: true,

      message:
        "Groq connection successful.",

      model,

      response:
        data?.choices?.[0]
          ?.message?.content || "OK",
    });

  } catch (error) {
    console.error(
      "Groq connection test error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to connect to Groq.",
      },
      {
        status: 500,
      }
    );
  }
}