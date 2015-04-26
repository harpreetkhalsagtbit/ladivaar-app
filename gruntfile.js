'use strict';
var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		rename: {
	        renameDocxToZip: {
	            src: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index.docx',
	            dest: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index.zip'
	        },
	        renameZipToDocx: {
	            src: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index.zip',
	            dest: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index.docx'
	        }
	    },
	    unzip: {
			extractZipFile: {
		     src: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index.zip',
		      dest: '@@All Siri Guru Granth Sahib in Gurmukhi, without Index'
			}
	    },
		convert: {
		    options: {
		      explicitArray: false,
		    },
		    xml2json: {
		        files: [
		          {
		            expand: true,
		            src: ['@@All Siri Guru Granth Sahib in Gurmukhi, without Index/word/document.xml'],
		            dest: './',
		            ext: '.json'
		          }
		        ]
		    }
		},
		'json-format': {
		    test: {
		        options: {
		            indent: 4
		        },
		        files: [
		            {
		                expand: true,
		                src:  ['./SGGS.json'],
		                dest: './'
		            }
		        ]
		    }
		}
	})

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

 // Load the plugin that provides the "rename" task.
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-zip');
grunt.loadNpmTasks('grunt-convert');
grunt.loadNpmTasks('grunt-json-format');

	grunt.registerTask('unicodeConversion', function() {
		var unicodeJsonObject = []
		var mappingObject = JSON.parse(fs.readFileSync('../Unicode-Input/lib/core/lang/punjabi/_jsonMaps/gurbaniAkharSlim.json').toString());
		var gurbaniJSON = JSON.parse(fs.readFileSync('@@All Siri Guru Granth Sahib in Gurmukhi, without Index/word/document.json').toString());
		var count = 0;
		if(gurbaniJSON && gurbaniJSON["w:document"] && gurbaniJSON["w:document"]["w:body"] && gurbaniJSON["w:document"]["w:body"]["w:p"]) {
			var _docContent = gurbaniJSON["w:document"]["w:body"]["w:p"]

			for(var i=0;i<_docContent.length;i++) {
				if(_docContent && _docContent[i] && _docContent[i]["w:r"] && _docContent[i]["w:r"]["w:t"] && _docContent[i]["w:r"]["w:t"]["_"]) {
					_docContent[i]["w:r"]["w:t"]["_"] = convertToUnicodeCLI(_docContent[i]["w:r"]["w:t"]["_"], mappingObject)
					var _panktiObj = {}

					if(_docContent[i]["w:r"] && _docContent[i]["w:r"]["w:rPr"] && _docContent[i]["w:r"]["w:rPr"]["w:rFonts"] && _docContent[i]["w:r"]["w:rPr"]["w:rFonts"]["w:ascii"] == "AnmolRaised") {
						_panktiObj["bold_Pankti"] = _docContent[i]["w:r"]["w:t"]["_"]
						if(_docContent[i]["w:r"]["w:tab"] == "") {
							_panktiObj["tab"] = true;
						}
					} else {
						_panktiObj["arrayOfPankti"] = []
						var obj = {};
						// Page break - when no Array Pankti
						if(_docContent[i]["w:r"]["w:lastRenderedPageBreak"] == "") {
							var _lastObj = _panktiObj["arrayOfPankti"][_panktiObj["arrayOfPankti"].length - 1]
							if(_lastObj) {
								_lastObj["pageBreak"] = true
								_lastObj["ang"] = ++count
							} else {
								var _lastBigObj = unicodeJsonObject[unicodeJsonObject.length-1]
								var _lastObj = _lastBigObj["arrayOfPankti"][_lastBigObj["arrayOfPankti"].length - 1]
								if(_lastObj) {
									_lastObj["pageBreak"] = true
									_lastObj["ang"] = ++count
								}
							}
						}

						obj["pankti"] = _docContent[i]["w:r"]["w:t"]["_"]
						if(_docContent[i]["w:r"]["w:tab"] == "") {
							obj["tab"] = true;
						}
						_panktiObj["arrayOfPankti"].push(obj)
					}

					unicodeJsonObject.push(_panktiObj)
				} else if(_docContent && _docContent[i] && _docContent[i]["w:r"].length) {

					var obj = {
						"arrayOfPankti": []
					}
					var pageBreakFound = false;
					for(var j=0;j<_docContent[i]["w:r"].length;j++) {
						var _panktiObj = {};

						if(_docContent[i]["w:r"][j] && _docContent[i]["w:r"][j]["w:t"] && _docContent[i]["w:r"][j]["w:t"]["_"] && typeof _docContent[i]["w:r"][j]["w:t"] == "object") {
							_docContent[i]["w:r"][j]["w:t"]["_"] = convertToUnicodeCLI(_docContent[i]["w:r"][j]["w:t"]["_"], mappingObject)
							if(_docContent[i]["w:r"] && _docContent[i]["w:r"][j]["w:rPr"] && _docContent[i]["w:r"][j]["w:rPr"]["w:rFonts"] && _docContent[i]["w:r"][j]["w:rPr"]["w:rFonts"]["w:ascii"] == "AnmolRaised") {
								_panktiObj["bold_Pankti"] = _docContent[i]["w:r"][j]["w:t"]["_"]
							} else {
								_panktiObj["pankti"] = _docContent[i]["w:r"][j]["w:t"]["_"]
							}

						} else if(typeof _docContent[i]["w:r"][j]["w:t"] == "string") {
							_panktiObj["noXML_Preserve"] = true
							_panktiObj["pankti"] = convertToUnicodeCLI(_docContent[i]["w:r"][j]["w:t"], mappingObject)
						}

						// Page break - Array Pankti
						if(_docContent[i]["w:r"][j]["w:lastRenderedPageBreak"] == "") {
							var _lastObj = obj["arrayOfPankti"][obj["arrayOfPankti"].length - 1]
							if(_lastObj) {
								_lastObj["pageBreak"] = true
								_lastObj["ang"] = ++count
							} else {
								var _lastBigObj = unicodeJsonObject[unicodeJsonObject.length-1]
								var _lastObj = _lastBigObj["arrayOfPankti"][_lastBigObj["arrayOfPankti"].length - 1]
								if(_lastObj) {
									_lastObj["pageBreak"] = true
									_lastObj["ang"] = ++count
								}
							}
							pageBreakFound = true
							unicodeJsonObject.push(JSON.parse(JSON.stringify(obj)))
							pageBreakFound = false;
							obj = {
								"arrayOfPankti": []
							}
						}
						if(_docContent[i]["w:r"][j]["w:tab"] == "") {
							_panktiObj["tab"] = true;
						}

						if(JSON.stringify(_panktiObj) != "{}") {
							obj["arrayOfPankti"].push(_panktiObj)
						}
					}
					unicodeJsonObject.push(obj)
				}
			}
			gurbaniJSON["w:document"]["w:body"]["w:p"] = _docContent
		}

		var _lastAng = unicodeJsonObject[unicodeJsonObject.length - 1]["arrayOfPankti"]
		var _lastPankti = _lastAng[_lastAng.length - 1]
		_lastPankti["pageBreak"] = true
		_lastPankti["ang"] = 1430
        fs.writeFileSync('SGGS.json', JSON.stringify(unicodeJsonObject));
	});
	
	grunt.registerTask('htmlJsonConversion', function() {
        var _sggsJson = JSON.parse(fs.readFileSync('SGGS.json').toString());
        var _startSection = "<section id='{{_id}}' route='{{_route}}'>"
        var _endSection = "</section>"
        var _startH_Tag = "<h1>"
        var _endH_Tag = "</h1>\n"
        var _startP_Tag = "<p>"
        var _endP_Tag = "</p>\n"

    	var _ang = '';
    	var _arrayAngs = [];
        for(var i=0;i<_sggsJson.length;i++) {
        	if(_ang == '') {
        		_ang += _startSection;
        	}
        	if(_sggsJson[i]["bold_Pankti"]) {
        		_ang += _startH_Tag + _sggsJson[i]["bold_Pankti"] + _endH_Tag
        		if(_sggsJson[i]["pageBreak"]) {
        			_ang += _endSection
        			// _ang = _ang.replace("{{_id}}", _sggsJson[i]["ang"])
        			_arrayAngs.push(_ang)
        			_ang = '';
        		}

        	} else if(_sggsJson[i]["arrayOfPankti"]) {
        		var _newPankti = true;
        		var _noXML_Preserve = false;
        		for(var j=0;j<_sggsJson[i]["arrayOfPankti"].length;j++) {
        			if(_sggsJson[i]["arrayOfPankti"][j]["bold_Pankti"]) {
		        		_ang += _startH_Tag + _sggsJson[i]["arrayOfPankti"][j]["bold_Pankti"] + _endH_Tag
        			} else if(_sggsJson[i]["arrayOfPankti"][j]["pankti"]) {
        				if(_sggsJson[i]["arrayOfPankti"][j]["tab"] && j != 0) {
        					_ang = _ang.substring(0, _ang.length - _endP_Tag.length)
			        		_ang += "&nbsp&nbsp&nbsp&nbsp" + _sggsJson[i]["arrayOfPankti"][j]["pankti"] + _endP_Tag
			        	} else if(_sggsJson[i]["arrayOfPankti"][j]["noXML_Preserve"] && j != 0) {
        					_ang = _ang.substring(0, _ang.length - _endP_Tag.length)
			        		_ang += _sggsJson[i]["arrayOfPankti"][j]["pankti"] + _endP_Tag
			        		_noXML_Preserve = true;
        				} else {
        					if(_noXML_Preserve) {
	        					_ang = _ang.substring(0, _ang.length - _endP_Tag.length)
				        		_ang += _sggsJson[i]["arrayOfPankti"][j]["pankti"] + _endP_Tag
				        		_noXML_Preserve = false;
        					} else {
				        		_ang += _startP_Tag + _sggsJson[i]["arrayOfPankti"][j]["pankti"] + _endP_Tag
        					}
        				}
        			}
	        		if(_sggsJson[i]["arrayOfPankti"][j]["pageBreak"]) {
	        			_ang += _endSection
	        			// _ang = _ang.replace("{{_id}}", _sggsJson[i]["arrayOfPankti"][j]["ang"])
	        			_arrayAngs.push(_ang)
	        			_ang = '';
	        		}
	        		_newPankti = false;
        		}
        	}
        	if(i == _sggsJson.length) {
        		// No page break at last
    			_ang += _endSection
    			_ang = _ang.replace("{{_id}}", "1430")
    			_arrayAngs.push(_ang)
    			_ang = '';
        	}
        }
        fs.writeFileSync('../reveal.js/indexLarivaar.json', JSON.stringify(_arrayAngs))
 	});

	grunt.registerTask('createJsonFilesOnGivenRange', function() {
		var range = 100;
        var jsonContent = JSON.parse(fs.readFileSync('../reveal.js/indexLarivaar.json').toString());
        var _count = 0;
        var splitJson = [];
        var startIndex = 0;
        var endIndex = startIndex + range;
        var ang = 1;
		var mappingObject = JSON.parse(fs.readFileSync('../Unicode-Input/lib/core/lang/punjabi/_jsonMaps/gurbaniAkharSlim.json').toString());
        var routeString = '<more-route name="{{_name}}" path="/{{_name}}"></more-route>'
        var _routeTemplateContent = [];

		var dir = "ang"
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
        for(var each in jsonContent) {
        	_count++;
        	var _jsonContent = jsonContent[each].replace("{{_id}}", "ang" + ang)
        	_jsonContent = _jsonContent.replace("{{_route}}", "ang/" + ang)
    		splitJson.push(_jsonContent)
    		_routeTemplateContent.push(routeString.replace(/{{_name}}/g, "ang/" + ang))
        		ang++;
        	if (_count == endIndex) {
       //  		splitJson.push(jsonContent[each].replace("{{_id}}", ang))
	    		// _routeTemplateContent.push(routeString.replace(/{{_name}}/g, "ang/" + ang))
       //  		ang++;
				var _htmlContent = fs.readFileSync('templates/code-lab_template.html').toString();
				var _routeContent = fs.readFileSync('templates/route_template.html').toString();
				var _indexContent = fs.readFileSync('templates/index_template.html').toString();

				// var _punjabiAng = convertToUnicodeCLI((startIndex+1) + " - " + _count, mappingObject)
				// _punjabiAng = _punjabiAng.replace("-", "&nbsp-&nbsp")
		  //       _htmlContent = _htmlContent.replace("{{angRangePunjabi}}", _punjabiAng)
		  //       _htmlContent = _htmlContent.replace("{{angRangeEnglish}}", (startIndex+1) + "&nbsp-&nbsp" + _count)
		        _htmlContent = _htmlContent.replace("{{sggs_content}}", splitJson.join("\n"))
		        _htmlContent = _htmlContent.replace("{{_route}}", 'route_' + (startIndex+1) + "_" + _count + ".html")
		        _htmlContent = _htmlContent.replace(/{{_startIndex}}/g, startIndex+1)
		        _htmlContent = _htmlContent.replace(/{{_endIndex}}/g, _count)

		        _routeContent = _routeContent.replace("{{route_content}}", _routeTemplateContent.join("\n"))
		        _indexContent = _indexContent.replace("{{_codelab}}", 'code-lab_' + (startIndex+1) + "_" + _count + ".html")
		        fs.writeFileSync('ang/code-lab_' + (startIndex+1) + "_" + _count + ".html", _htmlContent)
		        fs.writeFileSync('ang/route_' + (startIndex+1) + "_" + _count + ".html", _routeContent)
		        fs.writeFileSync('ang/index_' + (startIndex+1) + "_" + _count + ".html", _indexContent)
		        // fs.writeFileSync('../reveal.js/indexLarivaar.html', _htmlContent)

				startIndex = _count
		        endIndex = startIndex + range
		        if(endIndex > 1400) {
		        	endIndex = 1430
		        }
        		splitJson.splice(0);
        		_routeTemplateContent.splice(0)
        	}
        }
	});

	grunt.registerTask('copyDependentFilesToReveal', function() {
		var data = fs.readFileSync('indexLadivaar.html').toString();
		fs.writeFileSync('../reveal.js/index.html', data)

		var data = fs.readFileSync('lib/jquery-1.11.1.min.js').toString();
		fs.writeFileSync('../reveal.js/jquery-1.11.1.min.js', data)
		var fsExtra = require('fs-extra')
		fsExtra.copy("fonts/NotoSansGurmukhi-Regular.ttf","../reveal.js/NotoSansGurmukhi-Regular.ttf")
	});

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('default', ['rename:renameDocxToZip', 'unzip:extractZipFile', 'rename:renameZipToDocx', 'convert:xml2json', 'unicodeConversion', 'json-format:test', 'htmlJsonConversion', 'createJsonFilesOnGivenRange']);
}

var convertToUnicodeCLI = function(text, mappingString) {
    for(var each in mappingString) {
        text = text.split(each).join(mappingString[each])
    }
    text = text.replace(/ਿ(\W)/g,'$1' + 'ਿ')
    text = text.replace(/ਿ੍(\W)/g,'੍$1' + 'ਿ')
    text = text.replace(/ੇ੍(\W)/g, function(replaceMe, nextChar){
        return '੍' + nextChar + 'ੇ'
    })
    text = text.replace(/ੀ੍(\W)/g, function(replaceMe, nextChar){
        return '੍' + nextChar + 'ੀ'
    })
    text = text.replace(/ੵੰ/g,"ੰੵ")
    // text = text.replace(/ੵਾ/g,"ਾੵ")
    text = text.replace(/ਿੵ/g,"ੵਿ")

    text = text.replace(/ੑਾ/g,"ਾੑ")
    text = text.replace(/ੑੀ/g,"ੀੑ")
    text = text.replace(/ੑੇ/g,"ੇੑ")
    text = text.replace(/ਂੀ/g,"ੀਂ")
    text = text.replace(/ਿੰੵ/g,"ੵਿੰ")
    text = text.replace(/ੰੵ/g,"ੵੰ")
    text = text.replace(/ੑੁ/g,"ੁੑ")
    text = text.replace(/ੑੈ/g,"ੈੑ")

    // text = text.split('<ਬਰ>').join('</p><p>');
    // text = text.split('<ਬਰ>').join('</p><p>');
    // text = text.split('ਫ਼ਲਟ;').join('ੴ');
    // text = text.split('ƒ').join('ਨੂੰ');
    return text
}