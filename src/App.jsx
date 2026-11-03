import React from 'react';
import { CommunityDesk } from './components/CommunityDesk';
import './styles/fonts.css';
import './styles/join.css';

export default function App() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#0A0A0A' }}>
      <CommunityDesk />
    </main>
  );
}
