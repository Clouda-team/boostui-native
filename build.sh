rm -rf ./output

'r.js' -o build.js optimize=none
fis3 release -r ./ -f ./fis-conf.js -d ./output

rm boost.js