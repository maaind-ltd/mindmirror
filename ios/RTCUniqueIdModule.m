//
//  RTCUniqueIdModule.m
//  MindMirror
//
//  Created by Elias Rut on 23.02.22.
//

#import <Foundation/Foundation.h>
#import "RCTUniqueIdModule.h"

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


@end
