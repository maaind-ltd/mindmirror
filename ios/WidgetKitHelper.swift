//
//  WidgetKitHelper.swift
//  MindMirror
//
//  Created by Elias Rut on 09.03.22.
//

import WidgetKit

@available(iOS 14.0, *)
@objcMembers final class WidgetKitHelper: NSObject {
  
  class func reloadAllWidgets(){
    #if arch(arm64) || arch(i386) || arch(x86_64)
    WidgetCenter.shared.reloadAllTimelines()
    #endif
  }
}
