//
//  ContentView.swift
//  MindMirrorCompanion WatchKit Extension
//
//  Created by Martin Dinov on 11/02/2022.
//

import SwiftUI

struct ContentView: View {
  
  var title: String?;
  var message: String?;
  
  var body: some View {
        VStack {

            Text(title ?? "Unknown Landmark")
                .font(.headline)

            Divider()

            Text(message ?? "You are within 5 miles of one of your favorite landmarks.")
                .font(.caption)
        }
        .lineLimit(0)
  }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
