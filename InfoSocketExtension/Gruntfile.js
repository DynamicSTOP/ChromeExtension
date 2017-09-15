module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        compress: {
            release: {
                options: {
                    archive: 'build/release.zip',
                    pretty: true
                },
                expand: true,
                cwd: 'src/',
                src: [ '**/*' ],
                dest: './'
            }
        },
        webstore_upload: {
            "accounts": {
                "testacc": {
                    publish: true,
                    client_id: process.env.WEBSTORE_CLIENT_ID,
                    client_secret: process.env.WEBSTORE_CLIENT_SECRET,
                    refresh_token: process.env.WEBSTORE_REFRESH_TOKEN
                }
            },
            "extensions": {
                "testext": {
                    account: "testacc",
                    publish: true,
                    appID: "cjkcfamcldbmimahkmcgmcjhjlbgfded",
                    zip: "build/release.zip"
                }
            }
        },
        copy: {
            small: {
                files:[{
                    expand: true,
                    src: 'testImageSmall.jpg',
                    rename: function(){return "src/assets/img/testImage.jpg";}
                }]
            },
            huge: {
                files:[{
                    expand: true,
                    src: 'testImage.jpg',
                    rename: function(){return "src/assets/img/testImage.jpg";}
                }]
            }
        }
    });
    grunt.registerTask('webstore', [
        'copy:small',
        'compress:release',
        'webstore_upload:testext'
    ]);
};