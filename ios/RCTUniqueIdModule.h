//
//  RCTUniqueIdModule.h
//  MindMirror
//
//  Created by Elias Rut on 21.02.22.
//

#ifndef RCTUniqueIdModule_h
#define RCTUniqueIdModule_h

#import <React/RCTBridgeModule.h>
#import <WatchConnectivity/WatchCOnnectivity.h>
@interface RCTUniqueIdModule : NSObject <RCTBridgeModule, WCSessionDelegate>

@end

#endif /* RCTUniqueIdModule_h */
