module.exports = {
  siteMetadata: {
    title: "Strapi on Render Demo",
  },

  plugins: [
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: process.env.STRAPI_API_HOST
          ? `http://${process.env.STRAPI_API_HOST}.onrender.com`
          : "http://localhost:1337",
        singleTypes: ["page-info"],
      },
    },
  ],
};
