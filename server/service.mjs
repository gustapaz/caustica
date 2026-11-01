import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";
import { fail } from "./errors.mjs";
export const schema = t.Object(
  {
    rotation: t.Integer({ minimum: -60, maximum: 60 }),
    incidence: t.Integer({ minimum: -30, maximum: 30 }),
    offset: t.Integer({ minimum: -60, maximum: 60 }),
    index: t.Number({ minimum: 1.3, maximum: 1.9 }),
    dispersion: t.Integer({ minimum: 0, maximum: 100 }),
  },
  { additionalProperties: false },
);
export const meta = {
  slug: "caustica",
  title: "CÁUSTICA",
  engine: "elysia-typebox-optics",
  headline: "Um raio. Todos os caminhos.",
  default_input: {
    rotation: 0,
    incidence: 0,
    offset: 0,
    index: 1.45,
    dispersion: 70,
  },
  presets: [
    {
      name: "Espectro",
      input: {
        rotation: 0,
        incidence: 0,
        offset: 0,
        index: 1.45,
        dispersion: 70,
      },
    },
    {
      name: "Desvio",
      input: {
        rotation: 18,
        incidence: -12,
        offset: 10,
        index: 1.62,
        dispersion: 100,
      },
    },
    {
      name: "Reflexos",
      input: {
        rotation: -35,
        incidence: 20,
        offset: -20,
        index: 1.85,
        dispersion: 50,
      },
    },
  ],
  note: "Modelo óptico 2D: índices artísticos e dispersão de Cauchy parametrizada; não caracteriza vidros físicos.",
};
export function validate(input) {
  if (!Value.Check(schema, input))
    fail("invalid_input", "Confira ângulos, índice e dispersão.");
  return input;
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1],
  cross = (a, b) => a[0] * b[1] - a[1] * b[0],
  add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k],
  unit = (a) => {
    const l = Math.hypot(...a);
    return a.map((x) => x / l);
  };
export function refract(i, n, eta) {
  const c = -dot(i, n),
    k = 1 - eta * eta * (1 - c * c);
  return k < 0
    ? null
    : unit(
        add(
          i.map((x) => x * eta),
          n,
          eta * c - Math.sqrt(k),
        ),
      );
}
export function intersect(o, d, vertices) {
  let best;
  for (let j = 0; j < 3; j++) {
    const a = vertices[j],
      b = vertices[(j + 1) % 3],
      edge = [b[0] - a[0], b[1] - a[1]],
      den = cross(d, edge);
    if (Math.abs(den) < 1e-10) continue;
    const ao = [a[0] - o[0], a[1] - o[1]],
      distance = cross(ao, edge) / den,
      u = cross(ao, d) / den;
    if (
      distance > 1e-6 &&
      u >= -1e-9 &&
      u <= 1 + 1e-9 &&
      (!best || distance < best.distance)
    )
      best = {
        distance,
        point: add(o, d, distance),
        normal: unit([edge[1], -edge[0]]),
      };
  }
  return best;
}
export function compute(raw) {
  const p = validate(raw),
    a = (p.rotation * Math.PI) / 180,
    vertices = [
      [-1, -0.65],
      [1, -0.65],
      [0, 1.05],
    ].map(([x, y]) => [
      x * Math.cos(a) - y * Math.sin(a),
      x * Math.sin(a) + y * Math.cos(a),
    ]),
    angle = (p.incidence * Math.PI) / 180,
    colors = ["#8c66ff", "#408cff", "#43e1ce", "#f4ef76", "#ffb45c", "#ff5d79"];
  const rays = [430, 480, 530, 580, 630, 680].map((w, k) => {
    const n = p.index + (0.02 * (p.dispersion / 100)) / (w / 1000) ** 2;
    let o = [-3, p.offset / 100],
      d = [Math.cos(angle), Math.sin(angle)],
      inside = false,
      entered = false,
      reflections = 0;
    const segments = [];
    for (let step = 0; step < 8; step++) {
      const hit = intersect(o, d, vertices);
      if (!hit) {
        segments.push({
          from: o,
          to: add(o, d, 5),
          medium: inside ? "glass" : "air",
          event: "escape",
        });
        break;
      }
      let normal = inside ? hit.normal.map((x) => -x) : hit.normal;
      const next = refract(d, normal, inside ? n : 1 / n);
      segments.push({
        from: o,
        to: hit.point,
        medium: inside ? "glass" : "air",
        event: next ? "refract" : "reflect",
      });
      if (next) {
        d = next;
        inside = !inside;
        entered = true;
      } else {
        d = unit(add(d, normal, -2 * dot(d, normal)));
        reflections++;
      }
      o = add(hit.point, d, 1e-5);
    }
    return {
      wavelength_nm: w,
      index: n,
      color: colors[k],
      entered,
      reflections,
      segments,
      exit_angle_deg: (Math.atan2(d[1], d[0]) * 180) / Math.PI,
    };
  });
  return {
    model: "2d-snell-cauchy",
    vertices,
    rays,
    spread_deg:
      Math.max(...rays.map((r) => r.exit_angle_deg)) -
      Math.min(...rays.map((r) => r.exit_angle_deg)),
    max_interactions: 8,
  };
}
export function exportResult(input) {
  const r = compute(input);
  return {
    type: "application/json; charset=utf-8",
    extension: "json",
    text: JSON.stringify({ input, result: r }, null, 2),
  };
}
export const service = { meta, validate, compute, export: exportResult };
