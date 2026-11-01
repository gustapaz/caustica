import { test } from "node:test";
import assert from "node:assert/strict";
import { service, refract, intersect } from "../server/service.mjs";
test("normal incidence follows Snell without direction change", () => {
  assert.deepEqual(refract([1, 0], [-1, 0], 1 / 1.5), [1, 0]);
});
test("total internal reflection is represented as no refracted ray", () => {
  assert.equal(refract([Math.sqrt(0.75), 0.5], [0, -1], 1.5), null);
});
test("ray-segment intersection picks nearest forward surface", () => {
  const h = intersect(
    [-3, 0],
    [1, 0],
    [
      [-1, -1],
      [1, -1],
      [0, 1],
    ],
  );
  assert.ok(h.distance > 2 && h.distance < 3);
});
test("zero dispersion produces identical color paths", () => {
  const r = service.compute({ ...service.meta.default_input, dispersion: 0 });
  for (const ray of r.rays) assert.deepEqual(ray.segments, r.rays[0].segments);
  assert.equal(r.spread_deg, 0);
});
test("all presets bounded and finite", () => {
  for (const p of service.meta.presets) {
    const r = service.compute(p.input);
    assert.equal(r.rays.length, 6);
    for (const ray of r.rays) {
      assert.ok(ray.segments.length <= 8);
      for (const s of ray.segments)
        for (const x of [...s.from, ...s.to]) assert.ok(Number.isFinite(x));
    }
  }
});
test("invalid bounds unknown fields and NaN rejected", () => {
  for (const input of [
    { ...service.meta.default_input, index: 2 },
    { ...service.meta.default_input, rotation: 61 },
    { ...service.meta.default_input, dispersion: NaN },
    { ...service.meta.default_input, extra: 1 },
  ])
    assert.throws(() => service.compute(input));
});
