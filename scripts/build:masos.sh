#!/bin/bash

ignore_list="dist|scripts|\.idea|.*\.md|.*\.yml|node_modules"

electron-packager . stephen.k.Instagram --overwrite --out=dist --platform=darwin --arch=x64 --icon=static/icon.icns --app-version=$npm_package_version --ignore=${ignore_list}
