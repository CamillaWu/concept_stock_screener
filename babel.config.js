module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
        browsers: ['last 2 versions', 'safari >= 7']
      }
    }],
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  plugins: []
};
