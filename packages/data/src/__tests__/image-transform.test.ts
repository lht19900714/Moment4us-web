import { expect, test } from "vitest";

import { buildCloudflareImageSrcSet, buildCloudflareImageUrl } from "../images/transform";

test("buildCloudflareImageUrl encodes transform options in the final path segment", () => {
  expect(
    buildCloudflareImageUrl(
      "hero-image",
      { accountHash: "account123", variant: "public" },
      {
        width: 1200,
        height: 800,
        quality: 85,
        fit: "cover",
        format: "webp",
      },
    ),
  ).toBe(
    "https://imagedelivery.net/account123/hero-image/public/width=1200,height=800,quality=85,fit=cover,format=webp",
  );
});

test("buildCloudflareImageSrcSet reuses path-based width transforms", () => {
  expect(
    buildCloudflareImageSrcSet(
      "gallery-image",
      { accountHash: "account123", variant: "public" },
      [400, 800],
      { fit: "contain", quality: 75 },
    ),
  ).toBe(
    [
      "https://imagedelivery.net/account123/gallery-image/public/width=400,quality=75,fit=contain 400w",
      "https://imagedelivery.net/account123/gallery-image/public/width=800,quality=75,fit=contain 800w",
    ].join(", "),
  );
});
