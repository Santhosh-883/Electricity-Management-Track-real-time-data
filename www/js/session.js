// session.js - Cordova session/cookie isolation helper
// Requires cordova-plugin-cookie-manager (install with: cordova plugin add cordova-plugin-cookie-manager)

// This ensures cookies are cleared on logout and not shared across devices
// Call clearCookiesOnLogout() after logout or before login if needed

function clearCookiesOnLogout() {
    if (window.cookies && typeof window.cookies.clear === 'function') {
        window.cookies.clear(function() {
            console.log('All cookies cleared from WebView.');
        }, function(error) {
            console.error('Failed to clear cookies:', error);
        });
    } else {
        console.warn('cordova-plugin-cookie-manager not installed or cookies API unavailable.');
    }
}

// Optionally, call this on app startup to ensure a fresh session:
document.addEventListener('deviceready', function() {
    // Uncomment the next line if you want to always clear cookies on app start
    // clearCookiesOnLogout();
});

// Export for use elsewhere
window.clearCookiesOnLogout = clearCookiesOnLogout;
