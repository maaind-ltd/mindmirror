//
//  ContentView.swift
//  MindMirrorCompanion WatchKit Extension
//
//  Created by Martin Dinov on 11/02/2022.
//

import SwiftUI

struct ContentView: View {
  
  // TODO: Not sure what @StateObject does exactly
  var title: String?;
  var message: String?;
  var hrv: String?;
  @State private var workoutStarted = false
//  var workoutStarted: Bool;
//  @IBOutlet weak var myButton: WKInterfaceButton!
  
  func startWorkout() {
      print("Test!")
  }
  
  var body: some View {
        VStack {

          Text("HR: \(hrv ?? "---")")
          Divider()
          Button("Show details") {
            workoutStarted.toggle()
            startWorkout()
          }

          if workoutStarted {
            Text("Workout started")
              .fontWeight(.bold).foregroundColor(.green)
          } else {
            Text("No workout started")
              .fontWeight(.bold).foregroundColor(.red)
          }
        }
        .lineLimit(0)
  }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
      Group {
        ContentView()
      }
    }
}
