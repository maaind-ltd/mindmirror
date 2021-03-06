//
//  SharedStorage.m
//  MindMirror
//
//  Created by Elias Rut on 09.03.22.
//

#import "SharedStorage.h"
#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "MindMirror-Swift.h"

@implementation SharedStorage

RCT_EXPORT_MODULE(SharedStorage);

RCT_EXPORT_METHOD(set:(NSString *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.com.maaind.MindMirrorApp"];
    [shared setObject:data forKey:@"data"];
    [shared synchronize];
    
    RCTLogInfo(@"Received data %@", data);
    if (@available(iOS 14.0, *)) {
      [WidgetKitHelper reloadAllWidgets];
    } else {
      // Fallback on earlier versions: Do nothing
    }
    resolve(@"true");
  }@catch(NSException *exception){
    RCTLogInfo(@"Received error %@", exception.reason);
    reject(@"get_error", exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(getData:(NSString* )key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.com.maaind.MindMirrorApp"];
    NSString *currentValue = [shared stringForKey:key];
    [shared setObject:@"" forKey:key];
    [shared synchronize];
    
    resolve(currentValue);
  }@catch(NSException *exception){
    RCTLogInfo(@"Received error %@", exception.reason);
    reject(@"get_error", exception.reason, nil);
  }
}



@end
