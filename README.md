# User Management Web Application

## Features
- User Registration
- Secure Login
- User Activity Tracking
- Dashboard with User Profile

## Setup
1. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set environment variables
- Copy `.env.example` to `.env`
- Update `SECRET_KEY` with a unique value

4. Initialize the database
```bash
flask db upgrade
```

5. Run the application
```bash
flask run
```

## Customization
- Modify `models.py` to add/remove user fields
- Update forms in `forms.py` to match model changes
- Customize templates in the `templates/` directory

## Security
- Uses bcrypt for password hashing
- Implements CSRF protection
- Tracks user login activities
