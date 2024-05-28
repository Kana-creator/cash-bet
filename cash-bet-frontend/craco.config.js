module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve("buffer/"),
          timers: require.resolve("timers-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
};
