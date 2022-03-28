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
  @Environment(\.scenePhase) var scenePhase
  
  @SceneBuilder var body: some Scene {
      WindowGroup {
          NavigationView {
              StartView()
          }
          .sheet(isPresented: $workoutManager.showingSummaryView) {
              SummaryView()
          }
          .environmentObject(workoutManager)
      }.onChange(of: scenePhase) { newScenePhase in
        switch newScenePhase {
        case .active:
          print("App is active")
          workoutManager.requestAuthorization()
          workoutManager.startWorkout(workoutType: .running)
        case .inactive:
          print("App is inactive")
//          workoutManager.requestAuthorization()
//          workoutManager.session?.stopActivity(with: nil)
        case .background:
          print("App is in background")
//          workoutManager.session?.stopActivity(with: nil)
        @unknown default:
          print("Oh - interesting: I received an unexpected new value.")
        }
      }
    WKNotificationScene(controller: NotificationController.self, category: "myCategory")
  }
}
