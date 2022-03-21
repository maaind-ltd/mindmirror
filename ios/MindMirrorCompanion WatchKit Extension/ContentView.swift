//
//  ContentView.swift
//  MindMirrorCompanion WatchKit Extension
//
//  Created by Martin Dinov on 11/02/2022.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
      ZStack {
        Rectangle()
          .fill(.green)
          .frame(width: 100, height: 100)
          .cornerRadius(50)
        Rectangle()
          .fill(.white)
          .frame(width: 90, height: 90)
          .cornerRadius(45)
      }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
