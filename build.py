#!/usr/bin/python
#encoding=utf-8
import os
import sys
import re

leiaJS = open('LeiaCore.js','r')
leiaJSContent = leiaJS.read()
leiaJS.close()

#read version number
#[leiaJSContent,number] = re.subn("LEIA.REVISION.*?;", "LEIA.REVISION = '{0}';".format(version), leiaJSContent)
m = re.search("LEIA.REVISION.*?'(.+?)';", leiaJSContent)
if m:
	version = m.group(1)
else:
	version = 'version_error'

os.system('java -jar compiler/compiler.jar --warning_level=VERBOSE --jscomp_off=globalThis --compilation_level WHITESPACE_ONLY --third_party --jscomp_off=checkTypes --language_in=ECMASCRIPT5_STRICT --js=external/three.js --js=external/helvetiker_regular.typeface.js --js=external/helvetiker_bold.typeface.js --js=LeiaCore.js --js=LeiaKeystrokeHandler.js --js_output_file=LeiaCore-latest.min.js'.format(version))
