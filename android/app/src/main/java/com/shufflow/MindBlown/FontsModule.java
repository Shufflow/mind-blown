package com.shufflow.MindBlown;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;

public class FontsModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  FontsModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "Fonts";
  }

  @ReactMethod
  public void getAvailableFonts(Promise promise) {
      promise.resolve(Arguments.fromJavaArgs(new String[]{"Droid Sans", "Droid Serif", "Droid Sans Mono"}));
  }
}
