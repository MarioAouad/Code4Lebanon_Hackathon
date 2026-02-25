import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DataDashboard from './components/DataDashboard';

function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');

    return (
        <DashboardLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
            <DataDashboard currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </DashboardLayout>
    );
}

export default App;
