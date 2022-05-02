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

extension UIColor {
  convenience init(hex: Int) {
      let components = (
          R: CGFloat((hex >> 16) & 0xff) / 255,
          G: CGFloat((hex >> 08) & 0xff) / 255,
          B: CGFloat((hex >> 00) & 0xff) / 255
      )
      self.init(red: components.R, green: components.G, blue: components.B, alpha: 1)
  }
}

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
  var permissionsAlreadyAskedFor = false;
  
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
        if (!permissionsAlreadyAskedFor) {
          workoutManager.requestAuthorization()
          permissionsAlreadyAskedFor = true;
        }
        hr = workoutManager.heartRate
        stepCount = workoutManager.stepCount
        hrvSDNN = workoutManager.hrvSDNN
        otherEvents = workoutManager.otherEvents
        eventCountForSteps = workoutManager.eventCountForSteps
        otherEventType = workoutManager.otherEventType
        //get current system time in hours and minutes
        updateCurrentTime()
      }

      ZStack {
        HStack {
          VStack {
            //add heart icon in the color based on getColor function which has as its argument the workoutManager.mood, size 40
            Image(systemName: "heart.fill").foregroundColor(getColor(mood: workoutManager.mood)).font(.system(size: 25, weight: .bold, design: .rounded))
              let hrString = String(format: "%.0f", hr)
            Text(hrString).font(.system(size: 20)).foregroundColor(getColor(mood: workoutManager.mood))
          }.padding(.trailing, 15)
          VStack {
            // show an image of number of steps
            Image(systemName: "figure.walk.circle").foregroundColor(getColor(mood: workoutManager.mood)).font(.system(size: 25, weight: .bold, design: .rounded))
            let stepCountString = String(format: "%.0f", stepCount)
            Text(stepCountString).font(.system(size: 20)).foregroundColor(getColor(mood: workoutManager.mood))
          }
          
        }
        Circle().stroke(getColor(mood: workoutManager.mood), lineWidth: 7)
      }.frame(idealWidth: 230, idealHeight: 230, alignment: .center).padding(.top, 10)
    }
}

//function that returns a color based on a string's values
func getColor(mood: String) -> Color {
  switch mood {
  case "Mellow":
    return Color(UIColor(hex: 0x82C5E0))
  case "Flow":
    return Color(UIColor(hex: 0xBFDCBC))
  case "GoGoGo":
    return Color(UIColor(hex: 0xFFC999))
  default:
    return Color(UIColor(hex: 0xC0C0C0))
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
