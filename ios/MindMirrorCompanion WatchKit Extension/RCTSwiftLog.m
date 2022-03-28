//
//  RCTSwiftLog.m
//  MindMirrorCompanion WatchKit Extension
//
//  Created by Martin Dinov on 22/03/2022.
//

#import <Foundation/Foundation.h>
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <React/RCTLinkingManager.h>
//#import "RCTSwiftLog.h"

@implementation RCTSwiftLog(NSObject)

+ (void)info:(NSString *)message file:(NSString *)file line:(NSUInteger)line
{
    _RCTLogNativeInternal(RCTLogLevelInfo, file.UTF8String, (int)line, @"%@", message);
}

+ (void)warn:(NSString *)message file:(NSString *)file line:(NSUInteger)line
{
    _RCTLogNativeInternal(RCTLogLevelWarning, file.UTF8String, (int)line, @"%@", message);
}

+ (void)error:(NSString *)message file:(NSString *)file line:(NSUInteger)line
{
    _RCTLogNativeInternal(RCTLogLevelError, file.UTF8String, (int)line, @"%@", message);
}

+ (void)log:(NSString *)message file:(NSString *)file line:(NSUInteger)line
{
    _RCTLogNativeInternal(RCTLogLevelInfo, file.UTF8String, (int)line, @"%@", message);
}

+ (void)trace:(NSString *)message file:(NSString *)file line:(NSUInteger)line
{
    _RCTLogNativeInternal(RCTLogLevelTrace, file.UTF8String, (int)line, @"%@", message);
}

@end
