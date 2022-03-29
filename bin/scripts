#!/bin/bash

getProjectRootDir() {
  local projectPath
  local folders

  projectPath=$(pwd)
  folders=$(echo "$projectPath" | tr '/' "\n")

  for _ in $folders
  do
    if [ -f "$projectPath/package.json" ]
    then
      echo "$projectPath"
      return 0
    else
      # Go up one folder
      projectPath=$(echo "$projectPath" | sed -E 's/(.*)\/.*/\1/g')
    fi
  done

  return 1
}

projectRoot=$(getProjectRootDir)

clean() {
  rm -rf \
    "$projectRoot/node_modules" \
    "$projectRoot/package-lock.json" \
    "$projectRoot/yarn.lock"
}

prettify() {
  "$projectRoot/node_modules/.bin/pretty-quick" \
    --staged \
    --pattern '**/*.*(js|jsx)'
}

case "$1" in
  clean)
    clean
    ;;
  pre-commit)
    prettify
    ;;
esac
