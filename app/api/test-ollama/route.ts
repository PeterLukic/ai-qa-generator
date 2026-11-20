import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { apiKey, model } = body;

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Ollama API key is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!model || typeof model !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Model is required.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Testing Ollama connection with model:", model);

    // IMPORTANT:
    // Never log the API key.

    const response = await fetch(
      "https://ollama.com/api/chat",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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

          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Ollama connection failed:",
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
              "Invalid or unauthorized Ollama API key.",
          },
          {
            status: response.status,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Ollama connection failed (${response.status}).`,
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,

      message: "Ollama connection successful.",

      model,

      response:
        data?.message?.content || "OK",
    });
  } catch (error) {
    console.error(
      "Ollama connection test error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to connect to Ollama Cloud.",
      },
      {
        status: 500,
      }
    );
  }
}