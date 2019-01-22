#! /usr/bin/bash

OUT_FILE='src/assets/icons.ts'
IN_DIR='src/assets/icons'

FILES=$(find "${IN_DIR}" -type f -name '*.svg')

echo "// this file is auto-generated. Use 'yarn update-icons'\n" > $OUT_FILE
echo "const icons = {" >> $OUT_FILE

for FILE in $FILES; do
  filename=$(basename -- "$FILE")
  contents=$(cat "$FILE")
  echo "  ${filename%.*}: '${contents}'," >> $OUT_FILE
done

echo "};\n\nexport default icons;" >> $OUT_FILE
