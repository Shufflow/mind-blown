//
//  Fonts.m
//  MindBlown
//
//  Created by Flavio Caetano on 1/16/20.
//  Copyright © 2020 Shufflow. All rights reserved.
//

@import UIKit;
#import "Fonts.h"

@implementation Fonts

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getAvailableFonts:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(UIFont.familyNames);
};

@end
