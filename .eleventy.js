require('dotenv').config();
const yaml = require("js-yaml");
const slugify = require("slugify");
const Image = require("@11ty/eleventy-img");

async function thumbShortcode(src, alt, sizes = "100vw") {
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
  let fullscr = metadata.jpeg[2];

  return `<picture class="thumb" data-fullscreen="${fullscr.url}">
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
  eleventyConfig.addNunjucksAsyncShortcode("thumb", thumbShortcode);
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPassthroughCopy({
    "./src/_includes/base.css": "./base.css",
    "./src/scripts/base.js": "./base.js",
    "./src/scripts/animate.js": "./animate.js",
    "./src/_assets/": "./_assets/",
    "./src/admin": "./admin",
    "./static": "./"
  });
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );
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
