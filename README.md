# AHS Maps

**Improving Navigation and Efficiency Inside Allen High School**

AHS Maps is a mobile campus navigation app designed to help students, staff, and visitors move efficiently inside Allen High School. The app provides accurate indoor directions using pathfinding algorithms instead of GPS.

This project was developed by EduPath LLC in partnership with Allen High School.

---

# Overview

AHS Maps converts architectural floor plans into a digital graph system that allows users to find the shortest routes between classrooms, offices, and campus facilities.

The system works fully indoors and does not rely on GPS, which is unreliable inside large buildings.

---

# Features

AHS Maps provides classroom to classroom indoor navigation using Dijkstra’s and A* algorithms. Floor plans are converted into graph data using QGIS. The mobile UI is built with React Native and follows Allen ISD branding. Firebase is used for authentication, database, and storage. The architecture is designed for district-wide scalability.

---

# How It Works

Floor plans are digitized in QGIS. Hallways, rooms, stairs, and entrances are converted into graph nodes. Users select a start location and a destination. Dijkstra’s or A* calculates the shortest path, and step-by-step directions are displayed on the map.

---

# Tech Stack

Frontend: React Native, JavaScript, HTML, CSS
Backend and Services: Firebase Auth, Firebase Firestore, Firebase Storage, Node.js
Mapping and Algorithms: QGIS, Dijkstra’s Algorithm, A* Search
Tools: Git, NPM, CLI and Terminal

---

# About EduPath LLC

EduPath LLC was founded to build custom school navigation and utility apps.

As Founder and CEO, I led the development of AHS Maps for Allen High School. Responsibilities included client coordination, funding management, indoor navigation algorithm engineering, React Native app design and implementation, leading a small development team, on-site routing validation, and coordination with school IT and administration.

---

# Future Improvements

Future plans include support for multi-building campuses, elevator and accessibility routing, event and schedule based navigation, and an administrative map editor dashboard.
