#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface LockScreenModule : RCTEventEmitter <RCTBridgeModule>
@end

@implementation LockScreenModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"screenUnlocked"];
}

- (void)startObserving
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(handleScreenUnlock:)
                                             name:UIApplicationProtectedDataDidBecomeAvailable
                                           object:nil];
}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleScreenUnlock:(NSNotification *)notification
{
  [self sendEventWithName:@"screenUnlocked" body:@{}];
}

@end