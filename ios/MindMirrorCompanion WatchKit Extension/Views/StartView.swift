/*
See LICENSE folder for this sample’s licensing information.

Abstract:
The start view.
*/

import SwiftUI
import HealthKit
import os
import AVFoundation
//import RCTLogWrapper


//func RCTLogError(_ message: String, _ file: String=#file, _ line: UInt=#line) {
//    RCTSwiftLog.error(message, file: file, line: line)
//}
//
//func RCTLogWarn(_ message: String, _ file: String=#file, _ line: UInt=#line) {
//    RCTSwiftLog.warn(message, file: file, line: line)
//}
//
//func RCTLogInfo(_ message: String, _ file: String=#file, _ line: UInt=#line) {
//    RCTSwiftLog.info(message, file: file, line: line)
//}
//
//func RCTLog(_ message: String, _ file: String=#file, _ line: UInt=#line) {
//    RCTSwiftLog.log(message, file: file, line: line)
//}
//
//func RCTLogTrace(_ message: String, _ file: String=#file, _ line: UInt=#line) {
//    RCTSwiftLog.trace(message, file: file, line: line)
//}



struct StartView: View {
  
  @EnvironmentObject var workoutManager: WorkoutManager
  @StateObject var phoneMessaging = PhoneMessaging()
  
  var runningWorkout: HKWorkoutActivityType = .running
  @State var hr: Double = 0.00;
  @State var stepCount: Double = 0;
  @State var hrvSDNN: Double = 0;
  @State var eventCountForSteps = 3;
  @State var otherEvents = 5;
  @State var otherEventType = "--";
  @State private var workoutStarted = true;
  @State var currentTime = "";
  
  func updateCurrentTime() {
    let date = Date()
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    currentTime = formatter.string(from: date)
  }
  
    let healthStore = HKHealthStore()
  
    var body: some View {

      let _ = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) {
          (_) in
//        workoutManager.queryHeartRate()
        hr = workoutManager.heartRate
        stepCount = workoutManager.stepCount
        hrvSDNN = workoutManager.hrvSDNN
        otherEvents = workoutManager.otherEvents
        eventCountForSteps = workoutManager.eventCountForSteps
        otherEventType = workoutManager.otherEventType
        //get current system time in hours and minutes
        updateCurrentTime()
      }

      VStack {
        //show current time in big white letters
        Text(currentTime).font(.system(size: 40, weight: .bold, design: .rounded)).foregroundColor(Color.white)
        VStack {
          //add heart icon in the color based on getColor function which has as its argument the workoutManager.mood, size 40
          Image(systemName: "heart.fill").foregroundColor(getColor(mood: workoutManager.mood)).font(.system(size: 40, weight: .bold, design: .rounded))
            let hrString = String(format: "%.0f", hr)
          Text(hrString).font(.system(size: 20)).foregroundColor(getColor(mood: workoutManager.mood))
          }
        // Divider()
        // HStack {
        //   HStack {
        //     Image(systemName: "figure.walk.circle.fill")
        //                     .font(.system(size: 30))
        //     let stepCountString = String(format: "%.0f", stepCount)
        //     Text(stepCountString).fixedSize(horizontal: true, vertical: true)
        //   }
        // }.fixedSize(horizontal: false, vertical: true)
        // Divider()
        // VStack {
        //   let otherEventsString = String(format: "%d", otherEvents)
        //   Text(otherEventsString).fixedSize(horizontal: true, vertical: true)
        //   Divider()
        //   Text(workoutManager.mood).fixedSize(horizontal: true, vertical: true)
        // }
      }.frame(maxWidth: .infinity, maxHeight: .infinity).padding(.top, 10).padding()
        .overlay(
          RoundedRectangle(cornerRadius: 16)
            .stroke(getColor(mood: workoutManager.mood), lineWidth: 8))
    }
}

//function that returns a color based on a string's values
func getColor(mood: String) -> Color {
  switch mood {
  case "mellow":
    return Color.green
  case "flow":
    return Color.red
  case "gogogo":
    return Color.orange
  default:
    return Color.gray
  }
}

struct StartView_Previews: PreviewProvider {
    static var previews: some View {
        StartView().environmentObject(WorkoutManager())
    }
}

extension HKWorkoutActivityType: Identifiable {
    public var id: UInt {
        rawValue
    }

    var name: String {
        switch self {
        case .running:
            return "Run"
//        case .cycling:
//            return "Bike"
//        case .walking:
//            return "Walk"
        default:
            return ""
        }
    }
}
