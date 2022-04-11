//
//  WidgetKitHelper.swift
//  MindMirror
//
//  Created by Elias Rut on 09.03.22.
//

import WidgetKit
import WatchConnectivity

@available(iOS 14.0, *)
@objcMembers final class WidgetKitHelper: NSObject {
  
  class func reloadAllWidgets(){
    #if arch(arm64) || arch(i386) || arch(x86_64)
    WidgetCenter.shared.reloadAllTimelines()
    #endif
  }
}
//
//@available(iOS 13.0, *)
//@objcMembers final class ConnectivityRequestHandler: NSObject, ObservableObject {
//  var session = WCSession.default
//
//  override init() {
//    super.init()
//    session.delegate = self
//    session.activate()
//  }
//}
//
//@available(iOS 13.0, *)
//extension ConnectivityRequestHandler: WCSessionDelegate {
//  func sessionDidBecomeInactive(_ session: WCSession) {
//  }
//
//  func sessionDidDeactivate(_ session: WCSession) {
//  }
//
//  func sessionWatchStateDidChange(_ session: WCSession) {
//  }
//
//  func session(_ session:WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
//
//  }
//
//  func session(_: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any])->Void) {
//    debugPrint("didReceiveMessage: ", message)
//    if message["request"] as? String == "mood" {
//      replyHandler(["mood": "mellow"])
//    }
//  }
//}
