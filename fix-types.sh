
#!/usr/bin/env bash
RN_INDEX=./node_modules/@types/react-native/index.d.ts
DEV_DECLARE='declare global { const __DEV__: boolean; }'
INDEX_CONTENTS="$(cat $RN_INDEX)"

if [[ "$INDEX_CONTENTS" != *"$DEV_DECLARE" ]]; then
  ed -s $RN_INDEX <<< $',s/declare global/declare namespace FuckGlobals/g\nw'
  echo "\ndeclare global { const __DEV__: boolean; }" >> $RN_INDEX
fi
