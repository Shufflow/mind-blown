#! /bin/sh

if [ "$CI" != true ] && [ -z "$FASTLANE_LANE_NAME" ]; then
  yarn licenses generate-disclaimer -s > compiled_licenses.txt
else
  echo "Skipping license generation"
fi
