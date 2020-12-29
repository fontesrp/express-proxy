#!/bin/bash

get_project_root_dir() {
  local ORIGINAL_DIR=$(pwd)
  local SCRIPT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
  cd $ORIGINAL_DIR

  local FOLDERS=$(echo $SCRIPT_PATH | tr '/' "\n")

  for folder in $FOLDERS
  do
    local README_FILE=$(ls -la $SCRIPT_PATH | grep -c package.json)

    if [ $README_FILE == "0" ]
    then
      # Go up one folder
      SCRIPT_PATH=$(echo $SCRIPT_PATH | sed -E 's/(.*)\/.*/\1/g')
    else
      echo $SCRIPT_PATH
      return 0
    fi
  done

  return 1
}

PROJECT_ROOT=$(get_project_root_dir)
NODE_MODULES_BIN_PATH="$PROJECT_ROOT/node_modules/.bin"

clean() {
  rm -rf \
    $PROJECT_ROOT/node_modules \
    $PROJECT_ROOT/package-lock.json \
    $PROJECT_ROOT/yarn.lock
}

prettify() {
  $NODE_MODULES_BIN_PATH/pretty-quick --staged --ignore-path=$PROJECT_ROOT/.prettierignore
}

case "$1" in
  clean)
    clean
    ;;
  pre-commit)
    prettify
    ;;
esac
