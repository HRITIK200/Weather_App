# 🌦️  Weather App

## 📘 Project Overview
The **Weather App** is a fully interactive and responsive web application that provides **real-time weather information** for any city in the world.  
Built using **HTML, CSS, and JavaScript**, it integrates the **OpenWeatherMap API** to display:
- Current weather conditions    
- Auto-location weather detection  
- Dynamic background effects  

This project demonstrates **API integration, DOM manipulation, asynchronous JavaScript, and responsive web design** — all combined into a professional-grade user interface.

---

## 🎯 Objectives
- Build a dynamic weather application using **OpenWeatherMap API**.  
- Implement **real-time API calls** using `fetch()` and `async/await`.  
- Add **auto-location**. 
- Design a **beautiful, responsive, and modern UI**.

---

## ⚙️ Technologies Used
| Technology | Purpose |
|-------------|----------|
| **HTML5** | Page structure and layout |
| **CSS3** | Styling and responsive design |
| **JavaScript (ES6)** | Logic, API integration, and interactivity |
| **OpenWeatherMap API** | Real-time weather data |
| **Font Awesome** | Icons for UI |
| **Google Fonts (Poppins)** | Typography |
| **VS Code** | Development environment |

---

## 🧩 Features
✅ Live weather updates for any city  
✅ 5-day forecast view   
✅ Dynamic background based on weather condition  
✅ Auto-location detection (Geolocation API)  
✅ Local time display  
✅ Smooth animations and responsive design  
✅ Error handling for invalid inputs  


---
## 🖼️ Screenshots

1. Home Page 
   ![Home Page](./screenshots/Homepage.jpg)

2. Search bar 
   ![Search bar](./screenshots/search.jpg)

3. Auto Detect Location
   ![Auto Detect Location](./screenshots/autodetectlocation.jpg)
---

## 🧾 Folder Structure
weather-app/
│
├── index.html # Structure and layout
├── style.css # UI design and responsiveness
├── script.js # JS logic, API integration, theme, forecast
└── README.md # Documentation

## 🚀 How to Run the Project
1. Clone or download the project folder.  
2. Get a free API key from [https://openweathermap.org/api](https://openweathermap.org/api).  
3. Paste your API key inside `script.js`:
   ```js
   const apiKey = "YOUR_API_KEY";