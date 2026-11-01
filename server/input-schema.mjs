export const inputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["rotation", "incidence", "offset", "index", "dispersion"],
  properties: {
    rotation: { type: "integer", minimum: -60, maximum: 60 },
    incidence: { type: "integer", minimum: -30, maximum: 30 },
    offset: { type: "integer", minimum: -60, maximum: 60 },
    index: { type: "number", minimum: 1.3, maximum: 1.9 },
    dispersion: { type: "integer", minimum: 0, maximum: 100 },
  },
};
