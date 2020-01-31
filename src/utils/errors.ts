import crashlytics from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';

const defaultHandler = ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler(async (error: Error, isFatal?: boolean) => {
  await crashlytics().setAttribute('message', error.message);
  crashlytics().log(error.message);
  crashlytics().log(error.stack || 'Stack unknown');
  crashlytics().recordError(error);

  if (__DEV__) {
    defaultHandler.call(null, error, isFatal);
  } else if (Config.CRASH_JS_ERRORS) {
    crashlytics().crash();
  }
});
