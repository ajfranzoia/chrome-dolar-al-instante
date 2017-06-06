module.exports = {

  styles: [
    'src/styles/styles.less',
  ],

  scripts: {
    popup: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/lodash/lodash.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/moment/moment.js',
      'bower_components/moment/locale/es.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-utils/dist/angular-utils.js',
      'bower_components/chart.js/dist/Chart.min.js',
      'bower_components/angular-chart.js/dist/angular-chart.min.js',
      'src/js/popup/app.js',
      'src/js/popup/**/*.js',
      { path: '!src/js/popup/ga.js', env: 'dist' },
    ],
    background: [
      'src/js/background/background.js'
    ]
  },

  other: [
    'src/images/**/*',
    'src/fonts/**/*',
    'src/**/*.html',
    'src/manifest.json',
  ]
}
