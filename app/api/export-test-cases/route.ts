import ExcelJS from "exceljs";

type TableTestCase = {
  id: string;
  title: string;
  priority: string;
  testSteps: string[];
  expectedResult: string;
  status: string;
  bugId: string;
};

// =====================================================
// SAFE FILE NAME
// =====================================================

function sanitizeFileName(
  value: string
): string {
  const cleaned =
    value
      .replace(
        /[<>:"/\\|?*\x00-\x1F]/g,
        "_"
      )
      .trim();

  return (
    cleaned ||
    "RegressionTests"
  );
}

// =====================================================
// POST /api/export-test-cases
// =====================================================

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      testCases,
      fileName =
        "RegressionTests",
    } = body;

    // =================================================
    // VALIDATE
    // =================================================

    if (
      !Array.isArray(
        testCases
      ) ||
      testCases.length === 0
    ) {
      return Response.json(
        {
          error:
            "No test cases available for Excel export.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // WORKBOOK
    // =================================================

    const workbook =
      new ExcelJS.Workbook();

    workbook.creator =
      "AI QA Studio";

    workbook.created =
      new Date();

    // =================================================
    // WORKSHEET
    // =================================================

    const worksheet =
      workbook.addWorksheet(
        "Regression Tests"
      );

    worksheet.columns = [
      {
        header:
          "Test Case ID",
        key:
          "id",
        width:
          16,
      },
      {
        header:
          "Title",
        key:
          "title",
        width:
          36,
      },
      {
        header:
          "Priority",
        key:
          "priority",
        width:
          12,
      },
      {
        header:
          "Test Steps",
        key:
          "testSteps",
        width:
          55,
      },
      {
        header:
          "Expected Result",
        key:
          "expectedResult",
        width:
          45,
      },
      {
        header:
          "Status",
        key:
          "status",
        width:
          18,
      },
      {
        header:
          "Bug ID",
        key:
          "bugId",
        width:
          16,
      },
    ];

    // =================================================
    // HEADER
    // =================================================

    const headerRow =
      worksheet.getRow(
        1
      );

    headerRow.font = {
      bold:
        true,
    };

    headerRow.alignment = {
      vertical:
        "middle",
      horizontal:
        "center",
    };

    headerRow.height =
      24;

    // =================================================
    // DATA
    // =================================================

    for (
      const item of
      testCases as TableTestCase[]
    ) {
      worksheet.addRow({
        id:
          item.id || "",

        title:
          item.title || "",

        priority:
          item.priority || "",

        testSteps:
          Array.isArray(
            item.testSteps
          )
            ? item.testSteps
                .map(
                  (
                    step,
                    index
                  ) =>
                    `${index + 1}. ${step}`
                )
                .join(
                  "\n"
                )
            : "",

        expectedResult:
          item.expectedResult ||
          "",

        status:
          item.status ||
          "Not Executed",

        bugId:
          item.bugId ||
          "",
      });
    }

    // =================================================
    // FORMATTING
    // =================================================

    worksheet.views = [
      {
        state:
          "frozen",
        ySplit:
          1,
      },
    ];

    worksheet.autoFilter = {
      from:
        "A1",
      to:
        "G1",
    };

    worksheet.eachRow(
      (
        row,
        rowNumber
      ) => {
        if (
          rowNumber === 1
        ) {
          return;
        }

        row.alignment = {
          vertical:
            "top",
          wrapText:
            true,
        };
      }
    );

    // =================================================
    // GENERATE XLSX
    // =================================================

    const buffer =
      await workbook.xlsx
        .writeBuffer();

    const safeFileName =
      sanitizeFileName(
        fileName
      );

    const responseBody =
      new Uint8Array(
        buffer
      );

    return new Response(
      responseBody,
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            `attachment; filename="${safeFileName}.xlsx"`,

          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {
    console.error(
      "Excel export error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to export test cases to Excel.",
      },
      {
        status: 500,
      }
    );
  }
}