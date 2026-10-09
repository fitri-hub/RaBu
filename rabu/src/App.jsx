
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content" id="dashboard">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
