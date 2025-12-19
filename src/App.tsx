import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { Statistics } from './pages/Statistics';
import { MeasurementsCalendar } from './pages/MeasurementsCalendar';
import { BotSettings } from './pages/BotSettings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/measurements" element={<MeasurementsCalendar />} />
          <Route path="/bot" element={<BotSettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

