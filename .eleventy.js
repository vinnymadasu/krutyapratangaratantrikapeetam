module.exports = function (eleventyConfig) {
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
