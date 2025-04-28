import './App.css';
import Layout from './components/Layout';
import { WeatherProvider } from './context/WeatherContext';

import WeatherContent from './components/WeatherContent';

function App() {
  return (
    <WeatherProvider>
      <Layout>
        <WeatherContent />
      </Layout>
    </WeatherProvider>
  );
}

export default App;
