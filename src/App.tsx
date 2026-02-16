import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckInScreen } from './screens/CheckInScreen';
import { TermsScreen } from './screens/TermsScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckInScreen />} />
        <Route path="/termos" element={<TermsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
