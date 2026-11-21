export function getChunkAnalysisPrompt(
  chunk: string,
  chunkId: string
): string {
  return `
You are an experienced Senior QA Engineer.

You are analyzing ONE PART of a larger application DOM.

This DOM chunk is identified as:

${chunkId}

Your task is NOT to generate test cases.

Your task is to extract only the QA-relevant
functional evidence contained in this chunk.

The result will later be combined with analysis
from other DOM chunks.

=====================================================
GOAL
=====================================================

Create a SMALL structured summary of:

- User-facing functionality.
- Important user actions.
- Inputs and controls.
- Required fields.
- Explicit limits or constraints.
- Navigation.
- Validation evidence.
- Important business behavior visible in the DOM.
- Potential regression risks supported by the DOM.

Do NOT describe technical HTML implementation.

Do NOT generate test cases.

Do NOT generate BDD scenarios.

Do NOT invent functionality.

=====================================================
IMPORTANT RULE
=====================================================

This is only one chunk from a larger DOM.

Do NOT assume that this chunk represents
the entire application.

If information is incomplete,
report only what is actually supported.

Another chunk may contain additional functionality.

=====================================================
IGNORE
=====================================================

Ignore information whose main purpose is:

- CSS styling.
- CSS classes.
- Framework-specific attributes.
- Vue data-v attributes.
- React implementation details.
- Element IDs unless functionally meaningful.
- Decorative images.
- Icons.
- SVG.
- Layout containers.
- Spacing.
- Colors.
- Fonts.
- Technical DOM hierarchy.
- Internal implementation details.

=====================================================
INPUTS
=====================================================

For meaningful inputs, extract only evidence such as:

- User-facing name or label.
- Input type.
- Whether it is explicitly required.
- min.
- max.
- minlength.
- maxlength.
- pattern.
- Available choices.
- Other explicit restrictions.

Do NOT infer validation rules that are not present.

=====================================================
ACTIONS
=====================================================

Identify meaningful actions such as:

- Submit.
- Save.
- Delete.
- Search.
- Filter.
- Login.
- Logout.
- Add.
- Edit.
- Cancel.
- Navigate.
- Select.
- Upload.
- Download.

Use user-facing terminology where possible.

=====================================================
REGRESSION RISKS
=====================================================

Only identify risks directly related to
functionality visible in this chunk.

Examples:

- Core submission may stop working.
- Required information may not be enforced.
- Search may stop returning usable results.
- Navigation action may become unavailable.

Do NOT invent:

- API behavior.
- Database behavior.
- Backend behavior.
- Security rules.
- Exact error messages.
- Exact redirects.
- Permissions.
- Roles.
- Hidden business logic.

=====================================================
OUTPUT
=====================================================

Return ONLY valid JSON.

Do not return Markdown.

Do not use code fences.

Use EXACTLY this structure:

{
  "chunkId": "${chunkId}",
  "module": "Short user-facing module or Unknown",
  "userGoals": [
    "Important user goal"
  ],
  "actions": [
    "Meaningful user action"
  ],
  "inputs": [
    {
      "name": "User-facing input name",
      "type": "text",
      "required": false,
      "constraints": []
    }
  ],
  "navigation": [
    "Meaningful navigation option"
  ],
  "validationEvidence": [
    "Validation rule directly supported by DOM"
  ],
  "regressionRisks": [
    "Important regression risk supported by this chunk"
  ]
}

=====================================================
COMPACTNESS
=====================================================

Keep the result SMALL.

Maximum:

- 5 userGoals
- 8 actions
- 10 inputs
- 8 navigation items
- 8 validationEvidence items
- 6 regressionRisks

Do not repeat equivalent information.

If a category has no useful evidence,
return an empty array.

DOM CHUNK:

${chunk}
`;
}