//
//  RCTLogWrapper.h
//  MindMirror
//
//  Created by Martin Dinov on 22/03/2022.
//

#ifndef RCTLogWrapper_h
#define RCTLogWrapper_h


#endif /* RCTLogWrapper_h */

#import <Foundation/Foundation.h>

@interface RCTSwiftLog : NSObject

+ (void)error:(NSString * _Nonnull)message file:(NSString * _Nonnull)file line:(NSUInteger)line;
+ (void)warn:(NSString * _Nonnull)message file:(NSString * _Nonnull)file line:(NSUInteger)line;
+ (void)info:(NSString * _Nonnull)message file:(NSString * _Nonnull)file line:(NSUInteger)line;
+ (void)log:(NSString * _Nonnull)message file:(NSString * _Nonnull)file line:(NSUInteger)line;
+ (void)trace:(NSString * _Nonnull)message file:(NSString * _Nonnull)file line:(NSUInteger)line;

@end
