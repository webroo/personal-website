module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      site: ['out/']
    },
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'assets/',
            src: ['**', '.htaccess'],
            dest: 'out/'
          }
        ]
      }
    },
    stylus: {
      site: {
        files: {
          'out/styles/styles.css': 'src/styles/styles.styl'
        }
      }
    },
    haggerston: {
      options: {
        contentPath: 'src/content',
        templatesPath: 'src/templates',
        dest: 'out',
        swigFilters: {
          getArticles: function(pages, limit) {
            return pages.filter(function(page) {
              if (page.prettyUrl.search('/articles/.+') > -1) return true;
              return false;
            }).sort(function(a, b) {
              if (a.templateData.date < b.templateData.date) return 1;
              if (a.templateData.date > b.templateData.date) return -1;
              return 0;
            }).slice(0, limit);
          }
        }
      }
    },
    watch: {
      haggerston: {
        files: [
          'src/content/**/*.json',
          'src/content/**/*.md',
          'src/templates/**/*.html'
        ],
        tasks: 'haggerston'
      },
      stylus: {
        files: [
          'src/styles/**/*.styl'
        ],
        tasks: 'stylus'
      },
      assets: {
        files: [
          'assets/**'
        ],
        tasks: 'copy'
      }
    },
    connect: {
      site: {
        options: {
          base: 'out/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-haggerston');

  grunt.registerTask('build', ['clean', 'copy', 'stylus', 'haggerston']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('default', ['build']);
};
