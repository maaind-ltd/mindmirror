/*
See LICENSE folder for this sample’s licensing information.

Abstract:
The start view.
*/

import SwiftUI
import HealthKit

struct StartView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var runningWorkout: HKWorkoutActivityType = .running
    var hrv: String?;
    @State private var workoutStarted = false

    var body: some View {
      VStack {
        Text("HR: \(hrv ?? "---")")
        Divider()
        Button("Start") {
          workoutManager.startWorkout(workoutType: runningWorkout)
//          print("=>  \(workoutManager.$heartRate)")
          workoutStarted.toggle()
        }.onAppear {
          workoutManager.requestAuthorization()
        }
//            NavigationLink("Start", destination: SessionPagingView(),
//                           tag: workoutType, selection: $workoutManager.selectedWorkout)
//                .padding(EdgeInsets(top: 15, leading: 5, bottom: 15, trailing: 5))
//        .onAppear {
//            workoutManager.requestAuthorization()
//        }.onTapGesture {
//          workoutStarted.toggle()
//        }
        Divider()
        if workoutStarted {
          Text("Workout started")
            .fontWeight(.bold).foregroundColor(.green)
        } else {
          Text("No workout started")
            .fontWeight(.bold).foregroundColor(.red)
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
