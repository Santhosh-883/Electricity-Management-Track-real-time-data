// Only fetch and show voltage/current after device selection
// Assumes elements with ids 'voltage' and 'current' exist
// and a <select name="selected_device"> exists

document.addEventListener('DOMContentLoaded', function() {
    const deviceSelect = document.querySelector('select[name="selected_device"]');
    const voltageEl = document.getElementById('voltage');
    const currentEl = document.getElementById('current');

    // Clear values initially
    if(voltageEl) voltageEl.textContent = '-- V';
    if(currentEl) currentEl.textContent = '-- A';

    if(deviceSelect) {
        deviceSelect.addEventListener('change', function() {
            const deviceId = this.value;
            if (!deviceId) {
                if(voltageEl) voltageEl.textContent = '-- V';
                if(currentEl) currentEl.textContent = '-- A';
                return;
            }
            fetch(`/api/voltage_current?device_id=${deviceId}`)
                .then(response => response.json())
                .then(data => {
                    if(voltageEl) voltageEl.textContent = data.voltage !== null ? `${data.voltage} V` : '-- V';
                    if(currentEl) currentEl.textContent = data.current !== null ? `${data.current} A` : '-- A';
                })
                .catch(() => {
                    if(voltageEl) voltageEl.textContent = '-- V';
                    if(currentEl) currentEl.textContent = '-- A';
                });
        });
    }
});
