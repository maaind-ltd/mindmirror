//
//  MindMirrorWidget.swift
//  MindMirrorWidget
//
//  Created by Martin Dinov on 11/02/2022.
//

import WidgetKit
import SwiftUI


struct Shared:Decodable {
  let name: String
  let colors: [Int]
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), name: "No measured mood", color: Color(red: 0.84, green: 0.84, blue: 0.84))
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      
      let entry = SimpleEntry(date: Date(), name: "snapshot", color: Color(red: 0.84, green: 0.84, blue: 0.84))
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
      
      let userDefaults = UserDefaults(suiteName: "group.com.maaind.MindMirrorApp");
      var moodName = "No measured mood";
      var color = Color(red: 0.84, green: 0.84, blue: 0.84);
      do {
        let shared = userDefaults?.string(forKey: "data")
        
        if(shared != nil) {
          let data = try JSONDecoder().decode(Shared.self, from: shared!.data(using: .utf8)!);
          moodName = data.name;
          color = Color(red: Double(data.colors[0]) / 255.0, green: Double(data.colors[1]) / 255.0, blue: Double(data.colors[2]) / 255.0);
        }
      } catch {
        print(error);
      }
      
      let currentDate = Date()
      let entries: [SimpleEntry] = [
        SimpleEntry(date: currentDate, name: moodName, color: color)
        ]

      let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 30, to: currentDate)!
      let timeline = Timeline(entries: entries, policy: .after(nextUpdateDate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let name: String
  let color: Color
}

struct MindMirrorWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      VStack {
        Spacer()
        ZStack {
          Rectangle()
            .fill(entry.color)
            .frame(width: 100, height: 100)
            .cornerRadius(50)
          Rectangle()
            .fill(.white)
            .frame(width: 90, height: 90)
            .cornerRadius(45)
          Image("icon_voicecheckin_border")
            .resizable()
            .frame(width: 76, height: 76)
            
        }
        Spacer()
        ZStack {
          Rectangle()
            .fill(entry.color)
            .frame(height: 32)
          Text(entry.name).font(.system(size: 14)).foregroundColor(.black)
        }
      }.background(.white)
    }
}

@main
struct MindMirrorWidget: Widget {
    let kind: String = "MindMirrorWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MindMirrorWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("MindMirror Widget")
        .description("Displays your current mood.")
    }
}

struct MindMirrorWidget_Previews: PreviewProvider {
    static var previews: some View {
      MindMirrorWidgetEntryView(entry: SimpleEntry(date: Date(), name: "No measured mood", color: Color(red: 0.84, green: 0.84, blue: 0.84)))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
