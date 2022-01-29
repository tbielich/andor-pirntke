require('dotenv').config();
const slugify = require("slugify");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes = "100vw") {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [320, 640, 1280],
    formats: ['webp', 'jpeg'],
    urlPath: '/fahrzeuge/_images/',
    outputDir: './_site/fahrzeuge/_images/'
  });

  let lowsrc = metadata.jpeg[0];

  return `<picture data-fullscreen="${metadata.url}">
  ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n")}
  <img
  src="${lowsrc.url}"
  width="${lowsrc.width}"
  height="${lowsrc.height}"
  alt="${alt}"
  loading="lazy"
  decoding="async">
  </picture>`;
}

async function thumbShortcode(src, alt, sizes = "100vw") {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [320, 640],
    formats: ['webp', 'jpeg'],
    urlPath: '/fahrzeuge/_images/',
    outputDir: './_site/fahrzeuge/_images/'
  });

  let lowsrc = metadata.jpeg[0];

  return `<picture class="thumb">
  ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n")}
  <img
  src="${lowsrc.url}"
  width="${lowsrc.width}"
  height="${lowsrc.height}"
  alt="${alt}"
  loading="lazy"
  decoding="async">
  </picture>`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("thumb", thumbShortcode);
  eleventyConfig.addShortcode("res_endpoint", () => process.env.RES_ENDPOINT);

  eleventyConfig.addPassthroughCopy({
    "./src/_includes/base.css": "./base.css"
  });
  eleventyConfig.addPassthroughCopy({
    "./src/_assets/": "./_assets/"
  });

  eleventyConfig.addFilter("slugify", function (str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: undefined,
      remove: /[*+~.·,()'"`´%!?¿:@]/g,
      locale: 'de'
    });
  });

  // get the folder thumbnail
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  return {
    dir: {
      input: 'src',
    },
    htmlTemplateEngine: "njk",
  };
};
