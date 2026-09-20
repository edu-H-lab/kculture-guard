const ANSWER_STATES = [
  "NEED_CONFIRM",
  "NEED_RECALL",
  "NEED_CLARIFY",
  "NEED_REASON",
  "READY_EXPAND",
  "DEEP_ENOUGH",
  "OFF_TOPIC_OR_UNCLEAR",
  "NEED_FINAL_SUPPORT"
];

const ACTIONS = ["ASK", "SHOW_CHOICES", "FINISH"];

const askJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentLevel: { type: "integer" },
    coversValueQuestion: { type: "boolean" },
    missing: { type: "string" },
    strategy: { type: "string" },
    message: { type: "string" }
  },
  required: ["studentLevel", "coversValueQuestion", "missing", "strategy", "message"]
};

const turnJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answerState: { type: "string", enum: ANSWER_STATES },
    action: { type: "string", enum: ACTIONS },
    strategy: { type: "string" },
    message: { type: "string" },
    choices: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" }
        },
        required: ["label", "value"]
      }
    },
    finish: { type: "boolean" }
  },
  required: ["answerState", "action", "strategy", "message", "choices", "finish"]
};

const meaningCheckJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strategy: { type: "string" },
    message: { type: "string" },
    choices: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" }
        },
        required: ["label", "value"]
      }
    }
  },
  required: ["strategy", "message", "choices"]
};

const summaryJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" }
  },
  required: ["summary"]
};

function toGeminiSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  const out = {};
  if (schema.type) {
    const map = { object: "OBJECT", array: "ARRAY", string: "STRING", boolean: "BOOLEAN", number: "NUMBER", integer: "INTEGER" };
    out.type = map[String(schema.type).toLowerCase()] || String(schema.type).toUpperCase();
  }
  if (schema.enum) out.enum = schema.enum;
  if (schema.properties) {
    out.properties = {};
    Object.keys(schema.properties).forEach((key) => {
      out.properties[key] = toGeminiSchema(schema.properties[key]);
    });
  }
  if (schema.items) out.items = toGeminiSchema(schema.items);
  if (schema.required) out.required = schema.required;
  return out;
}

function normalizeTurn(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const answerState = ANSWER_STATES.includes(data.answerState) ? data.answerState : "";
  let action = ACTIONS.includes(data.action) ? data.action : "";
  const finish = data.finish === true || action === "FINISH";
  if (finish) action = "FINISH";
  const choices = Array.isArray(data.choices)
    ? data.choices.map((item) => ({
      label: String((item && (item.label || item.value)) || "").trim(),
      value: String((item && (item.value || item.label)) || "").trim()
    })).filter((item) => item.label)
    : [];
  if (!answerState || !action) return null;
  return {
    answerState,
    action,
    strategy: String(data.strategy || ""),
    message: String(data.message || "").trim(),
    choices,
    finish
  };
}

function normalizeSummary(raw) {
  const summary = raw && typeof raw === "object" ? String(raw.summary || "").trim() : "";
  if (!summary) return null;
  return { summary };
}

function normalizeMeaningCheck(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const message = String(data.message || "").trim();
  const choices = Array.isArray(data.choices)
    ? data.choices.map((item) => ({
      label: String((item && (item.label || item.value)) || "").trim(),
      value: String((item && (item.value || item.label)) || "").trim()
    })).filter((item) => item.label)
    : [];
  if (!message || choices.length < 2) return null;
  if (choices.length > 4) choices.length = 4;
  if (!choices.some((item) => /다른 생각/.test(item.label))) {
    if (choices.length >= 4) choices[3] = { label: "다른 생각이 있어", value: "other" };
    else choices.push({ label: "다른 생각이 있어", value: "other" });
  }
  return {
    strategy: "meaning-check",
    message,
    choices,
    action: "SHOW_CHOICES",
    finish: false
  };
}

function normalizeAsk(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const message = String(data.message || "").trim();
  if (!message) return null;
  const level = Number(data.studentLevel);
  return {
    strategy: String(data.strategy || "").trim() || "expand",
    message,
    studentLevel: Number.isFinite(level) ? level : null,
    coversValueQuestion: typeof data.coversValueQuestion === "boolean" ? data.coversValueQuestion : null,
    missing: String(data.missing || "").trim()
  };
}

module.exports = {
  ANSWER_STATES,
  ACTIONS,
  askJsonSchema,
  turnJsonSchema,
  summaryJsonSchema,
  meaningCheckJsonSchema,
  toGeminiSchema,
  normalizeTurn,
  normalizeAsk,
  normalizeMeaningCheck,
  normalizeSummary
};
