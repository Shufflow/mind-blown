/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

@import Firebase;
@import GoogleMobileAds;

#import <React/RCTBridge.h>
#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <React/RCTLinkingManager.h>
#import <RNCPushNotificationIOS.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNGoogleSignin.h>
#import "ReactNativeConfig.h"
#import "RNSplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configureWithOptions:
   [[FIROptions alloc]
    initWithGoogleAppID:[ReactNativeConfig envFor:@"FIREBASE_IOS_APP_ID"]
    GCMSenderID:[ReactNativeConfig envFor:@"FIREBASE_MSG_SENDER_ID"]
  ]];
  [FIRAnalytics setAnalyticsCollectionEnabled:true];

  [GADMobileAds configureWithApplicationID:[ReactNativeConfig envFor:@"ADMOB_IOS_ID"]];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Mind Blown"
                                            initialProperties:nil];
  rootView.backgroundColor = UIColor.blackColor;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNSplashScreen show];
  return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RNGoogleSignin application:app openURL:url options:options] || [RCTLinkingManager application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

#pragma mark - Notifications

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  FIRMessaging.messaging.APNSToken = deviceToken;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  [FIRMessaging.messaging appDidReceiveMessage:userInfo];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

@end
