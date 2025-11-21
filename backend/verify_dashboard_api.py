import urllib.request
import urllib.error
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def make_request(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    
    if data:
        data_bytes = json.dumps(data).encode('utf-8')
    else:
        data_bytes = None

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode('utf-8')
            try:
                json_body = json.loads(body)
            except:
                json_body = body
            return status, json_body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 500, str(e)

def test_dashboard_api():
    print("Starting Dashboard API Verification (urllib)...")

    # 1. Create Users (Patient and Professional)
    patient_email = f"patient_{uuid.uuid4()}@test.com"
    pro_email = f"pro_{uuid.uuid4()}@test.com"
    
    # Register Patient
    print(f"\n1. Registering Patient: {patient_email}")
    # Note: Magic link request creates user with all roles in dev mode
    status, resp = make_request("/auth/magic-link/request", "POST", {"email": patient_email})
    if status == 200:
        print("   -> Success")
    else:
        print(f"   -> Failed: {resp}")
        return

    # Register Professional
    print(f"\n2. Registering Professional: {pro_email}")
    status, resp = make_request("/auth/magic-link/request", "POST", {"email": pro_email})
    if status == 200:
        print("   -> Success")
    else:
        print(f"   -> Failed: {resp}")
        return

    # 2. Update Patient Profile
    print("\n3. Updating Patient Profile")
    profile_data = {
        "full_name": "Test Patient",
        "mobility_traits": ["limited_squat", "knee_pain"],
        "recovery_goals": ["run_5k", "squat_100kg"],
        "surgery_info": {"type": "acl_repair", "date": "2023-01-01"}
    }
    # Need to pass email as query param or handle auth. 
    # The endpoint definition is: def update_user_profile(update: UserProfileUpdate, email: str, ...)
    # So it expects email as query param.
    status, resp = make_request(f"/user/profile?email={patient_email}", "PUT", profile_data)
    if status == 200:
        print("   -> Success")
    else:
        print(f"   -> Failed: {resp}")

    # 3. Create Program (by Professional)
    print("\n4. Creating Program")
    program_data = {
        "title": "ACL Recovery Phase 1",
        "description": "Initial recovery exercises",
        "exercises": ["squat", "lunge"],
        "created_by_email": pro_email
    }
    status, resp = make_request("/programs", "POST", program_data)
    if status == 200:
        program_id = resp["id"]
        print(f"   -> Success (Program ID: {program_id})")
    else:
        print(f"   -> Failed: {resp}")
        return

    # 4. List Programs
    print("\n5. Listing Programs")
    status, resp = make_request("/programs", "GET")
    if status == 200:
        print(f"   -> Success (Found {len(resp)} programs)")
    else:
        print(f"   -> Failed: {resp}")

    # 5. Assign Program to Patient
    print("\n6. Assigning Program to Patient")
    assign_data = {
        "program_id": program_id,
        "patient_email": patient_email
    }
    status, resp = make_request("/programs/assign", "POST", assign_data)
    if status == 200:
        print("   -> Success")
    else:
        print(f"   -> Failed: {resp}")

    # 6. Get Patient Program
    print("\n7. Getting Patient Program")
    # Note: The endpoint in api.py is @router.get("/patient/program") which becomes /api/patient/program
    # But in the script I was using /api/patient/program?email=...
    # Wait, make_request appends endpoint to BASE_URL.
    # If BASE_URL is .../api, then endpoint should be /patient/program
    # But in previous script I had /api/patient/program in the call.
    # I should fix that too.
    
    status, resp = make_request(f"/patient/program?email={patient_email}", "GET")
    if status == 200:
        print(f"   -> Success (Assigned: {resp['program_title']})")
    else:
        print(f"   -> Failed: {resp}")

    # 7. Send Message
    print("\n8. Sending Message")
    msg_data = {
        "sender_email": pro_email,
        "receiver_email": patient_email,
        "content": "Hello, how are you feeling today?"
    }
    status, resp = make_request("/messages", "POST", msg_data)
    if status == 200:
        print("   -> Success")
    else:
        print(f"   -> Failed: {resp}")

    # 8. Get Messages
    print("\n9. Getting Messages")
    status, resp = make_request(f"/messages/{patient_email}", "GET")
    if status == 200:
        print(f"   -> Success (Found {len(resp)} messages)")
    else:
        print(f"   -> Failed: {resp}")

if __name__ == "__main__":
    test_dashboard_api()
