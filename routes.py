from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from models import db, User, ElectricityBill, BlynkDevice, assign_badges_for_user, get_user_badges, award_signup_badge
import requests

# Create a blueprint for electricity-related routes
electricity_bp = Blueprint('electricity', __name__)

@electricity_bp.route('/electricity_usage')
@login_required
def electricity_usage():
    award_signup_badge(current_user)
    assign_badges_for_user(current_user)
    # DEBUG: Force badges to a test value
    badges = ["Welcome Aboard", "Energy Saver"]
    # Ensure 'Welcome Aboard' badge is always shown
    if 'Welcome Aboard' not in badges:
        badges.append('Welcome Aboard')
    # Fetch any other required data for the template (e.g., usage, advice)
    return render_template('electricity_usage.html', badges=badges)

@electricity_bp.route('/electricity_bills')
@login_required
def electricity_bills():
    award_signup_badge(current_user)
    assign_badges_for_user(current_user)
    """
    Electricity bills page with cost details and account information
    
    Features:
    1. Show user's account number
    2. Display daily bill history
    3. Placeholders for future preference and messaging modules
    """
    # Fetch user's electricity bills
    bills = ElectricityBill.query.filter_by(user_id=current_user.id).order_by(ElectricityBill.date.desc()).all()
    
    # Prepare bill data for template
    bill_data = []
    for bill in bills:
        bill_data.append({
            'date': bill.date,
            'total_energy': bill.total_energy,
            'total_cost': bill.total_cost,
            'co2_emission': bill.co2_emission,
            'cost_breakdown': bill.cost_breakdown
        })
    
    # Render electricity bills template
    return render_template(
        'electricity_bills.html', 
        account_number=current_user.account_number,
        bills=bill_data,
        preferences_module=None,  # Placeholder for future preferences module
        messaging_module=None     # Placeholder for future messaging module
    )

# Device ON/OFF API
@electricity_bp.route('/api/device_switch', methods=['POST'])
def device_switch():
    data = request.get_json()
    state = data.get('state')
    if state not in [0, 1]:
        return '', 204
    token = "sGa2Ws1F_FjLjdZYWB-zk4Wf2kjCozkG"
    url = f"https://blr1.blynk.cloud/external/api/update?token={token}&V4={state}"
    requests.get(url, timeout=5)
    return '', 204

@electricity_bp.route('/api/device_state', methods=['GET'])
def device_state():
    token = "sGa2Ws1F_FjLjdZYWB-zk4Wf2kjCozkG"
    url = f"https://blr1.blynk.cloud/external/api/get?token={token}&V4"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            return jsonify({'state': int(resp.text.strip())})
        else:
            return jsonify({'state': None}), 500
    except Exception:
        return jsonify({'state': None}), 500

# Voltage/Current API
@electricity_bp.route('/api/voltage_current', methods=['GET'])
def voltage_current():
    device_id = request.args.get('device_id')
    device = BlynkDevice.query.get(device_id)
    if not device:
        return jsonify({"voltage": None, "current": None}), 404
    token = device.auth_token
    url_v0 = f"https://blr1.blynk.cloud/external/api/get?token={token}&V0"
    url_v1 = f"https://blr1.blynk.cloud/external/api/get?token={token}&V1"
    try:
        resp_v0 = requests.get(url_v0, timeout=5)
        resp_v1 = requests.get(url_v1, timeout=5)
        voltage = float(resp_v0.text.strip()) if resp_v0.status_code == 200 else None
        current = float(resp_v1.text.strip()) if resp_v1.status_code == 200 else None
        return jsonify({"voltage": voltage, "current": current})
    except Exception:
        return jsonify({"voltage": None, "current": None}), 500

# Power advice logic

def get_power_advice(power):
    if power > 500:
        return {
            "status": "CRITICAL",
            "message": "⚠ Very high usage! Turn off heavy appliances like AC, oven, or washing machine."
        }
    elif power > 300:
        return {
            "status": "HIGH",
            "message": "🔍 High usage detected. Consider reducing usage—check water heater, fridge, or motor."
        }
    elif power > 100:
        return {
            "status": "MEDIUM",
            "message": "✅ Moderate usage. Consider turning off unused lights or fans."
        }
    else:
        return {
            "status": "LOW",
            "message": "🟢 Low power usage. All systems running efficiently."
        }

@electricity_bp.route('/api/power_advice', methods=['GET'])
def power_advice():
    token = "sGa2Ws1F_FjLjdZYWB-zk4Wf2kjCozkG"
    url = f"https://blr1.blynk.cloud/external/api/get?token={token}&V2"  # Assume V2 is power
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            try:
                power = float(resp.text.strip())
            except Exception:
                power = 0.0
            advice = get_power_advice(power)
            advice["power"] = power
            return jsonify(advice)
        else:
            return jsonify({"status": "UNKNOWN", "message": "Could not fetch power data.", "power": None}), 500
    except Exception:
        return jsonify({"status": "UNKNOWN", "message": "Could not fetch power data.", "power": None}), 500

@electricity_bp.route('/api/delete_device/<int:device_id>', methods=['POST'])
def delete_device(device_id):
    device = BlynkDevice.query.get(device_id)
    if not device:
        return {'success': False, 'message': 'Device not found'}, 404
    # Delete all related logs first
    for log in device.data_logs:
        db.session.delete(log)
    db.session.delete(device)
    db.session.commit()
    return {'success': True, 'message': 'Device removed'}

# Placeholder routes for future modules
@electricity_bp.route('/preferences')
@login_required
def preferences():
    """Placeholder for future preferences module"""
    return "Preferences module coming soon!"

@electricity_bp.route('/messages')
@login_required
def messages():
    """Placeholder for future messaging module"""
    return "Messaging module coming soon!"
