// Stub for Settings/Personalization page
import React from 'react';

const SettingsPage = () => {
    // Toggle for auto-select recommended platforms
    // TODO: Connect to global/user state
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Personalization</h2>
            <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Auto-select recommended platforms</span>
            </label>
        </div>
    );
};

export default SettingsPage;
