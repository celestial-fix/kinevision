import os
import sys

# Add the backend directory to the sys.path so we can import from it
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from main import app

# This is needed for Vercel to find the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
