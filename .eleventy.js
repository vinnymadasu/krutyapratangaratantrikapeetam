module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("inr", (value) => Number(value).toLocaleString("en-IN"));

  return {
    dir: {
      input: "src",
      output: ".",
      includes: "_includes"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
