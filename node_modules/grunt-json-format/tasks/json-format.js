module.exports = function(grunt) {
    grunt.registerMultiTask(
        'json-format',
        'A Grunt Task for formatting JSON files.',
        function() {
            var options,
                succeededFiles;
    
            options = this.options({
                indent: null,
                remove: []
            });

            succeededFiles = this.files.filter(function(fileOptions) {
                return fileOptions.src
                    .filter(exists)
                    .filter(function process(filepath) {
                        var parsedObject,
                            processedJSON;

                        try {
                            parsedObject = grunt.file.readJSON(filepath);
                            grunt.log.verbose.write('Formatting ' + filepath + ' to ' + fileOptions.dest + '...');
                            processedJSON = JSON.stringify(parsedObject, removePropertyReplacer, options.indent);
                            grunt.file.write(fileOptions.dest, processedJSON);
                            grunt.log.verbose.ok();
                            return true;
                        } catch(e) {
                            grunt.fail.warn(e);
                            return false;
                        }
                    });
            });
    
            grunt.log.oklns(succeededFiles.length + ' JSON ' + grunt.util.pluralize(succeededFiles.length, 'file/files') + ' formatted.');
        
            function removePropertyReplacer(key, value) {
                if(options.remove.indexOf(key) !== -1) {
                    return undefined;
                }
                return value;
            }
            
            function exists(path) {
                var fileExists = grunt.file.exists(path);
                if (!fileExists) {
                    grunt.fail.warn('Source file "' + path + '" not found.');
                }
                return fileExists;
            }
        }
    );
};
