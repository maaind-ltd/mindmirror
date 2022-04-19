/*
See LICENSE folder for this sample’s licensing information.

Abstract:
The workout manager that interfaces with HealthKit.
*/

import Foundation
import HealthKit
import WatchConnectivity

class WorkoutManager: NSObject, ObservableObject {
    var selectedWorkout: HKWorkoutActivityType? {
        didSet {
            guard let selectedWorkout = selectedWorkout else { return }
            startWorkout(workoutType: selectedWorkout)
        }
    }

    @Published var showingSummaryView: Bool = false {
        didSet {
            if showingSummaryView == false {
                resetWorkout()
            }
        }
    }

    let healthStore = HKHealthStore()
    var session: HKWorkoutSession?
    var builder: HKLiveWorkoutBuilder?
  
    var watchkitSession = WCSession.default

    // Start the workout.
    func startWorkout(workoutType: HKWorkoutActivityType) {
        let configuration = HKWorkoutConfiguration()
        configuration.activityType = workoutType
        configuration.locationType = .outdoor

        // Create the session and obtain the workout builder.
        do {
            session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
            builder = session?.associatedWorkoutBuilder()
        } catch {
            // Handle any exceptions.
            return
        }

        // Setup session and builder.
        session?.delegate = self
        builder?.delegate = self

        // Set the workout builder's data source.
        builder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore,
                                                     workoutConfiguration: configuration)

        // Start the workout session and begin data collection.
        let startDate = Date()
        session?.startActivity(with: startDate)
        builder?.beginCollection(withStart: startDate) { (success, error) in
            // The workout has started.
        }
     
      watchkitSession.delegate = self
      watchkitSession.activate()
    }

    // Request authorization to access HealthKit.
    func requestAuthorization() {
        // The quantity type to write to the health store.
        let typesToShare: Set = [
            HKQuantityType.workoutType()
        ]

        // The quantity types to read from the health store.
        let typesToRead: Set = [
            HKQuantityType.quantityType(forIdentifier: .heartRate)!,
            HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKQuantityType.quantityType(forIdentifier: .distanceCycling)!,
            HKQuantityType.quantityType(forIdentifier: .stepCount)!,
            HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
            HKObjectType.activitySummaryType()
        ]

        // Request authorization for those quantity types.
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { (success, error) in
            // Handle error.
        }
    }

    // MARK: - Session State Control

    // The app's workout state.
    @Published var running = false

    func togglePause() {
        if running == true {
            self.pause()
        } else {
            resume()
        }
    }

    func pause() {
        session?.pause()
    }

    func resume() {
        session?.resume()
    }

    func endWorkout() {
        session?.end()
        showingSummaryView = true
    }

    // function that returns steps over the last 24 hours
    func getSteps() -> Double {
        let calendar = Calendar.current
        let now = Date()
        let startOfDay = calendar.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: HKQuantityType.quantityType(forIdentifier: .stepCount)!,
                                      quantitySamplePredicate: predicate,
                                      options: .cumulativeSum) { (query, result, error) in
                                        if let result = result {
                                            let steps = result.sumQuantity()
                                            self.stepCount = steps!.doubleValue(for: HKUnit.count())
                                        }
        }
        healthStore.execute(query)
        return stepCount
    }

    // MARK: - Workout Metrics
    @Published var averageHeartRate: Double = 0
    @Published var heartRate: Double = 0
    @Published var activeEnergy: Double = 0
    @Published var distance: Double = 0
    @Published var stepCount: Double = 0
    @Published var hrvSDNN: Double = 0
    @Published var eventCountForSteps: Int = 3
    @Published var otherEvents: Int = 5
    @Published var otherEventType: String = ""
    @Published var workout: HKWorkout?
    @Published var mood: String = "-"
    @Published var heartRatesCsv: String = ""

    func updateForStatistics(_ statistics: HKStatistics?) {
        guard let statistics = statistics else { return }
      
        self.eventCountForSteps += 1

        DispatchQueue.main.async {
            switch statistics.quantityType {
                case HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN):
                    self.stepCount = self.getSteps()
                    let heartRateUnit = HKUnit.count().unitDivided(by: HKUnit.minute())
                    self.hrvSDNN = statistics.mostRecentQuantity()?.doubleValue(for: heartRateUnit) ?? 42
                    break
                case HKQuantityType.quantityType(forIdentifier: .heartRate):
                    self.stepCount = self.getSteps()
                    let heartRateUnit = HKUnit.count().unitDivided(by: HKUnit.minute())
                    self.heartRate = statistics.mostRecentQuantity()?.doubleValue(for: heartRateUnit) ?? 30
                    self.averageHeartRate = statistics.averageQuantity()?.doubleValue(for: heartRateUnit) ?? 0
                    // Store the new heart rate info in the shared storage object
                    let millis = String(statistics.endDate.timeIntervalSince1970)
                    self.heartRatesCsv += millis + ":" + String(self.heartRate) + ";"
                    break
                case HKQuantityType.quantityType(forIdentifier: .stepCount):
                    self.stepCount = self.getSteps()
                    // let stepCountUnit = HKUnit.count()
                    // self.stepCount = statistics.mostRecentQuantity()?.doubleValue(for: stepCountUnit) ?? 0
                    // self.distance = statistics.sumQuantity()?.doubleValue(for: stepCountUnit) ?? 0
                    break
                case HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning):
                    let distanceUnit = HKUnit.mile().unitDivided(by: HKUnit.meter())
                    self.distance = statistics.sumQuantity()?.doubleValue(for: distanceUnit) ?? 0
                    break

                default:
                    self.stepCount = self.getSteps()
                    self.otherEventType = statistics.quantityType.description
                    self.otherEvents += 1
                    break
            }
        }
    }

    func resetWorkout() {
        selectedWorkout = nil
        builder = nil
        workout = nil
        session = nil
        activeEnergy = 0
        averageHeartRate = 0
        heartRate = 0
        hrvSDNN = 0
        stepCount = 0
        eventCountForSteps = 3
        otherEvents = 5
        distance = 0
    }
}

// MARK: - HKWorkoutSessionDelegate
extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState,
                        from fromState: HKWorkoutSessionState, date: Date) {
        DispatchQueue.main.async {
            self.running = toState == .running
        }

        // Wait for the session to transition states before ending the builder.
        if toState == .ended {
            builder?.endCollection(withEnd: date) { (success, error) in
                self.builder?.finishWorkout { (workout, error) in
                    DispatchQueue.main.async {
                        self.workout = workout
                    }
                }
            }
        }
    }

    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {

    }
}

// MARK: - HKLiveWorkoutBuilderDelegate
extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {

    }

    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType else {
                return // Nothing to do.
            }

            let statistics = workoutBuilder.statistics(for: quantityType)

            // Update the published values.
            updateForStatistics(statistics)
        }
    }
}

extension WorkoutManager: WCSessionDelegate {
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
  
  func session(_: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    if message["request"] as? String == "heartrates" {
      replyHandler(["heartrates": self.heartRatesCsv])
      // Clear the heartrates for the next time it's pulled
      self.heartRatesCsv = ""
    } else if message["request"] as? String == "mood" {
      replyHandler(["status": "received"])
      self.mood = message["mood"] as? String ?? "Unknown"
    }
  }
}
