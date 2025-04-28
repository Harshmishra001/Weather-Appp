# Advanced Weather App

A feature-rich weather application built with React, Vite, and Tailwind CSS that provides comprehensive weather information.

## Features

- **Current Weather Data**: Temperature, humidity, wind speed, and more
- **5-Day Forecast**: Detailed hourly weather predictions
- **Interactive Weather Charts**: Visualize temperature, humidity, and wind speed trends
- **Weather Maps**: View temperature, precipitation, wind, and cloud maps
- **Air Quality Index**: Monitor air pollution levels
- **Geolocation Support**: Get weather for your current location
- **Search History**: Quick access to previously searched locations
- **Unit Conversion**: Toggle between metric and imperial units
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Design**: Works on all devices

## Technologies Used

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **OpenWeatherMap API**: Weather data provider
- **Canvas API**: For custom weather charts
- **Local Storage**: For saving user preferences

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React](https://reactjs.org/) for the frontend framework
