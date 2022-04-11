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
      }
      
      VStack {
        Divider()
        HStack {
          HStack {
            Image(systemName: "heart")
                            .font(.system(size: 30))
            let hrString = String(format: "%.0f", hr)
            Text(hrString).fixedSize(horizontal: true, vertical: true)
          }
          Divider()
          HStack {
            Image(systemName: "figure.walk.circle.fill")
                            .font(.system(size: 30))
            let stepCountString = String(format: "%.0f", stepCount)
            Text(stepCountString).fixedSize(horizontal: true, vertical: true)
          }
        }.fixedSize(horizontal: false, vertical: true)
        Divider()
        if workoutStarted {
          HStack {
            Image(systemName: "bolt.heart")
                            .font(.system(size: 30))
            let hrvString = String(format: "%.0f", hrvSDNN)
            Text(hrvString).fixedSize(horizontal: true, vertical: true)
          }
        }
        Divider()
        VStack {
          let eventCountForStepsString = String(format: "%d", eventCountForSteps)
          Text(eventCountForStepsString).fixedSize(horizontal: true, vertical: true)
          Divider()
          let otherEventsString = String(format: "%d", otherEvents)
          Text(otherEventsString).fixedSize(horizontal: true, vertical: true)
          Divider()
//          let otherEventsDescription = String(format: "%s", phoneMessaging)
          Text(workoutManager.mood).fixedSize(horizontal: true, vertical: true)

//          Rectangle()
//            .fill(Color.red)
//            .frame(width: 300, height: 300)
        }
      }
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
