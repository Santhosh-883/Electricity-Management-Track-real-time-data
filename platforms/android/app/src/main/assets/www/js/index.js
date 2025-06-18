/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    // Clear all cookies/session on app startup (optional, recommended for kiosk/multi-user devices)
    window.clearCookiesOnLogout();
}

// Show a WhatsApp-style notification
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = '#323232';
    notification.style.color = '#fff';
    notification.style.padding = '14px 32px';
    notification.style.borderRadius = '24px';
    notification.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '1.1em';
    notification.style.opacity = '1';
    notification.style.transition = 'opacity 0.5s, top 0.5s';
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.top = '0px';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.top = '20px';
            notification.style.opacity = '1';
        }, 500);
    }, duration);
}
window.showNotification = showNotification;

// Global logout function to be called on user logout
function logoutUser() {
    // Your app's logout logic here (e.g., redirect to login, clear local storage, etc.)
    // ...

    // Clear cookies/session to ensure next user/device starts fresh
    window.clearCookiesOnLogout();

    // Example: Redirect to login page after logout
    window.location.href = 'login.html';
}

// Example: Wire logoutUser to a button (uncomment if you have a logout button with id="logout-btn")
// document.getElementById('logout-btn').addEventListener('click', logoutUser);
