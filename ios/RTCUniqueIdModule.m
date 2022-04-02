//
//  RTCUniqueIdModule.m
//  MindMirror
//
//  Created by Elias Rut on 23.02.22.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "RCTUniqueIdModule.h"

@interface RCTUniqueIdModule ()

@property (strong, nonatomic) WCSession *session;

@end

@implementation RCTUniqueIdModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(performPostRequest:(NSString *)url
                  jsonData:(NSString *)jsonData
                  cb:(RCTResponseSenderBlock)callback) {
  RCTLogInfo(@"Pretending to send a request to %@", url);
}

RCT_EXPORT_METHOD(startSpotifyAuthentication) {
  RCTLogInfo(@"Starting spotify authentication");
}

RCT_EXPORT_METHOD(getSpotifyToken:(RCTResponseSenderBlock)callback) {
  RCTLogInfo(@"getting spotify token");
}

RCT_EXPORT_METHOD(getSpotifyMessage:(RCTResponseSenderBlock)callback) {
  RCTLogInfo(@"getting spotify token");
}

RCT_EXPORT_METHOD(startWatchSession: resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"Tring to start watch session");
  if ([WCSession isSupported]){
    self.session = [WCSession defaultSession];
    self.session.delegate = self;
    [self.session activateSession];
    RCTLogInfo(@"Watch session started");
    resolve(@"Watch session started");
  } else {
    RCTLogInfo(@"Failed to start watch session");
    reject(@"UniqueIdModule_startWatchSession", @"Could not start session", nil);
  }
}

RCT_EXPORT_METHOD(getHeartRates: resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"Getting heart rates");
  NSDictionary *dict = [NSDictionary dictionaryWithObject:@"heartrates" forKey:@"request"];
  [self.session sendMessage:dict replyHandler:^(NSDictionary<NSString *,id> * _Nonnull replyMessage) {
    
    RCTLogInfo(@"Return value received");
    resolve(replyMessage);
  } errorHandler:^(NSError * _Nonnull error) {
    
    RCTLogInfo(@"Error received");
    reject(@"received error", error.description, nil);
  }];
}

RCT_EXPORT_METHOD(setWatchMood:(NSString *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"Setting watch mood");
  NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:data, @"mood", @"mood", @"request", nil];
  [self.session sendMessage:dict replyHandler:^(NSDictionary<NSString *,id> * _Nonnull replyMessage) {
    
    RCTLogInfo(@"Return value received");
    resolve(replyMessage);
  } errorHandler:^(NSError * _Nonnull error) {
    
    RCTLogInfo(@"Error received");
    reject(@"UniqueIdModule_setWatchMood", error.description, nil);
  }];
}

- (void)session:(nonnull WCSession *)session activationDidCompleteWithState:(WCSessionActivationState)activationState error:(nullable NSError *)error {
  RCTLogInfo(@"Watchkit session started");
}

- (void)sessionDidBecomeInactive:(nonnull WCSession *)session {
  RCTLogInfo(@"Watchkit session became inactive");
}

- (void)sessionDidDeactivate:(nonnull WCSession *)session {
  RCTLogInfo(@"Watchkit session ended");
}

@end
