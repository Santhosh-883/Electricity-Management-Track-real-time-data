// Device Switch Toggle Handler
function setDeviceState(state) {
    fetch('/electricity/api/device_switch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ state })
    }).then(() => {
        updateDeviceState();
    });
}

function updateDeviceState() {
    fetch('/electricity/api/device_state')
        .then(response => response.json())
        .then(data => {
            const state = data.state;
            document.getElementById('device-switch-status').textContent = state === 1 ? 'ON' : 'OFF';
            const btn = document.getElementById('device-switch-btn');
            if (btn) {
                btn.setAttribute('data-state', state);
                btn.textContent = state === 1 ? 'Turn OFF' : 'Turn ON';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    function updateVoltageCurrent() {
        fetch('/electricity/api/voltage_current')
            .then(r => r.json())
            .then(data => {
                const volt = document.getElementById('voltage-value');
                const curr = document.getElementById('current-value');
                if (volt) volt.textContent = (data.voltage !== null && !isNaN(data.voltage)) ? data.voltage.toFixed(1) : '--';
                if (curr) curr.textContent = (data.current !== null && !isNaN(data.current)) ? data.current.toFixed(2) : '--';
            })
            .catch(() => {
                const volt = document.getElementById('voltage-value');
                const curr = document.getElementById('current-value');
                if (volt) volt.textContent = '--';
                if (curr) curr.textContent = '--';
            });
    }
    updateVoltageCurrent();
    setInterval(updateVoltageCurrent, 2000);

    function updateBoxAdvice() {
        fetch('/electricity/api/power_advice')
            .then(r => r.json())
            .then(data => {
                const badge = document.getElementById('box-advice-status');
                const msg = document.getElementById('box-advice-message');
                if (!badge || !msg) return;
                badge.textContent = data.status || 'UNKNOWN';
                msg.textContent = data.message || 'Power advice unavailable.';
                badge.className = 'badge mb-2 ' + (
                    data.status === 'CRITICAL' ? 'bg-danger' :
                    data.status === 'HIGH' ? 'bg-warning text-dark' :
                    data.status === 'MEDIUM' ? 'bg-info text-dark' :
                    data.status === 'LOW' ? 'bg-success' :
                    'bg-secondary'
                );
            })
            .catch(() => {
                const badge = document.getElementById('box-advice-status');
                const msg = document.getElementById('box-advice-message');
                if (!badge || !msg) return;
                badge.textContent = 'UNKNOWN';
                msg.textContent = 'Power advice unavailable (fetch error).';
                badge.className = 'badge mb-2 bg-secondary';
            });
    }
    updateBoxAdvice();
    setInterval(updateBoxAdvice, 1000);

    const switchBtn = document.getElementById('device-switch-btn');
    if (switchBtn) {
        switchBtn.addEventListener('click', function() {
            const currentState = switchBtn.getAttribute('data-state') === '1' ? 1 : 0;
            const newState = currentState === 1 ? 0 : 1;
            setDeviceState(newState);
            switchBtn.setAttribute('data-state', newState);
            switchBtn.textContent = newState === 1 ? 'Turn OFF' : 'Turn ON';
        });
    }
});
