import { Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Page/Home';
import Test from './Page/Test';
import TestTwo from './Page/TestTwo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      <Route path="/test-two" element={<TestTwo />} />
    </Routes>
  );
}

export default App;
