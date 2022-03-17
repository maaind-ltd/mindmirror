//
//  MindMirrorApp.swift
//  MindMirrorCompanion WatchKit Extension
//
//  Created by Martin Dinov on 11/02/2022.
//

import SwiftUI

@main
struct MindMirrorApp: App {
  /* Note on @StateObject:
      SwiftUI’s @StateObject property wrapper is designed to fill a very specific gap in state management: when you need to create a reference type inside one of your views and make sure it stays alive for use in that view and others you share it with.
   
   
   */
  @StateObject private var workoutManager = WorkoutManager()
  
  @SceneBuilder var body: some Scene {
      WindowGroup {
          NavigationView {
              ContentView()
          }
          .sheet(isPresented: $workoutManager.showingSummaryView) {
              SummaryView()
          }
          .environmentObject(workoutManager)
      }
    WKNotificationScene(controller: NotificationController.self, category: "myCategory")
  }
}
