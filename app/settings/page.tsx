"use client";

import { useEffect, useState } from "react";

const OLLAMA_MODELS = [
  {
    value: "gemma4:31b",
    label: "Gemma 4 31B",
  },
  {
    value: "gpt-oss:20b",
    label: "GPT-OSS 20B",
  },
  {
    value: "gpt-oss:120b",
    label: "GPT-OSS 120B",
  },
  {
    value: "nemotron-3-nano:30b",
    label: "Nemotron 3 Nano 30B",
  },
  {
    value: "nemotron-3-super",
    label: "Nemotron 3 Super",
  },
  {
    value: "nemotron-3-ultra",
    label: "Nemotron 3 Ultra",
  },
];

type ConnectionResult = {
  success: boolean;
  message: string;
};

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

  const [generatorModel, setGeneratorModel] =
    useState("gpt-oss:20b");

  const [reviewerModel, setReviewerModel] =
    useState("gpt-oss:120b");

  const [saved, setSaved] = useState(false);

  const [isTesting, setIsTesting] =
    useState(false);

  const [connectionResult, setConnectionResult] =
    useState<ConnectionResult | null>(null);

  // =====================================================
  // LOAD SAVED SETTINGS
  // =====================================================

  useEffect(() => {
    const storedApiKey =
      sessionStorage.getItem("ollamaApiKey");

    const storedGenerator =
      localStorage.getItem("generatorModel");

    const storedReviewer =
      localStorage.getItem("reviewerModel");

    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    if (storedGenerator) {
      setGeneratorModel(storedGenerator);
    }

    if (storedReviewer) {
      setReviewerModel(storedReviewer);
    }
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const saveSettings = () => {
    sessionStorage.setItem(
      "ollamaApiKey",
      apiKey.trim()
    );

    localStorage.setItem(
      "generatorModel",
      generatorModel
    );

    localStorage.setItem(
      "reviewerModel",
      reviewerModel
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =====================================================
  // TEST ONE MODEL
  // =====================================================

  const testModel = async (
    model: string
  ) => {
    const response = await fetch(
      "/api/test-ollama",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          apiKey: apiKey.trim(),
          model,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          `Failed to test model ${model}.`
      );
    }

    return data;
  };

  // =====================================================
  // TEST CONNECTION
  // =====================================================

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setConnectionResult({
        success: false,
        message:
          "Please enter your Ollama API key first.",
      });

      return;
    }

    try {
      setIsTesting(true);
      setConnectionResult(null);

      // Test generator model
      await testModel(generatorModel);

      // Test reviewer only if it is different
      if (reviewerModel !== generatorModel) {
        await testModel(reviewerModel);
      }

      setConnectionResult({
        success: true,
        message:
          "Connection successful. Generator and Reviewer models are available.",
      });
    } catch (error) {
      if (error instanceof Error) {
        setConnectionResult({
          success: false,
          message: error.message,
        });
      } else {
        setConnectionResult({
          success: false,
          message:
            "Unable to connect to Ollama Cloud.",
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Configure your Ollama API connection and
            AI models used by the QA generators.
          </p>
        </div>

        {/* SETTINGS CARD */}

        <div className="rounded-2xl bg-white p-8 shadow">

          {/* =====================================================
              API KEY
          ===================================================== */}

          <div>
            <label className="block text-lg font-semibold text-gray-900">
              Ollama API Key
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Your API key is stored only for the
              current browser session.
            </p>

            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setConnectionResult(null);
              }}
              placeholder="Enter your Ollama API key"
              autoComplete="off"
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="my-8 border-t border-gray-200" />

          {/* =====================================================
              GENERATOR MODEL
          ===================================================== */}

          <div>
            <label className="block text-lg font-semibold text-gray-900">
              Generator Model
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Creates the initial QA test suite,
              Page Object Model, or step definitions.
            </p>

            <select
              value={generatorModel}
              onChange={(event) => {
                setGeneratorModel(
                  event.target.value
                );

                setConnectionResult(null);
              }}
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
            >
              {OLLAMA_MODELS.map((model) => (
                <option
                  key={model.value}
                  value={model.value}
                >
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="my-8 border-t border-gray-200" />

          {/* =====================================================
              REVIEWER MODEL
          ===================================================== */}

          <div>
            <label className="block text-lg font-semibold text-gray-900">
              Reviewer Model
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Reviews the generated output, removes
              weak results, and improves QA quality.
            </p>

            <select
              value={reviewerModel}
              onChange={(event) => {
                setReviewerModel(
                  event.target.value
                );

                setConnectionResult(null);
              }}
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
            >
              {OLLAMA_MODELS.map((model) => (
                <option
                  key={model.value}
                  value={model.value}
                >
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* =====================================================
              CURRENT CONFIGURATION
          ===================================================== */}

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">
              Current Configuration
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Generator:</strong>{" "}
                {generatorModel}
              </p>

              <p>
                <strong>Reviewer:</strong>{" "}
                {reviewerModel}
              </p>

              <p>
                <strong>API Key:</strong>{" "}
                {apiKey
                  ? "Configured"
                  : "Not configured"}
              </p>
            </div>
          </div>

          {/* =====================================================
              TEST CONNECTION
          ===================================================== */}

          <button
            onClick={testConnection}
            disabled={
              !apiKey.trim() || isTesting
            }
            className="mt-8 w-full rounded-lg border-2 border-blue-600 px-6 py-4 font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            {isTesting
              ? "Testing Ollama Connection..."
              : "Test Connection"}
          </button>

          {/* CONNECTION RESULT */}

          {connectionResult && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                connectionResult.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {connectionResult.success
                ? "✓ "
                : "✗ "}

              {connectionResult.message}
            </div>
          )}

          {/* =====================================================
              SAVE SETTINGS
          ===================================================== */}

          <button
            onClick={saveSettings}
            disabled={!apiKey.trim()}
            className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Save Settings
          </button>

          {saved && (
            <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-700">
              ✓ Settings saved successfully.
            </div>
          )}

        </div>

        {/* SECURITY NOTE */}

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-900">
            API Key Security
          </h3>

          <p className="mt-2 text-sm text-blue-800">
            Your Ollama API key is stored in
            sessionStorage, so it is removed when the
            browser session ends. Your selected AI models
            are stored locally so they remain selected
            for future sessions.
          </p>
        </div>

      </div>
    </main>
  );
}