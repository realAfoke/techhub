import base64
import json
import requests
import uuid
import random
import string
from Crypto.Cipher import AES
import hashlib

# === Your Flutterwave Sandbox Keys ===
encryption_key = "qTIoSQxPoTzN4maDb0GLHcPHs2nnGQ6+VivD3/HCs+s="
access_token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1Mk9OdTBoU1A3WGpPS0RDOHZoZ2FpLWdHYlMtWWJoMzZSLUM3M2ZRcWtnIn0.eyJleHAiOjE3NTc5MzQyMzAsImlhdCI6MTc1NzkzMzYzMCwianRpIjoiYWUzMmRjMTQtNjllZS00YWU2LTg3ZWMtMzI1NDRkMDUzNjZkIiwiaXNzIjoiaHR0cHM6Ly9pZHAuZmx1dHRlcndhdmUuY29tL3JlYWxtcy9mbHV0dGVyd2F2ZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkM2ZmYTY4OC1jZjMzLTQ3NWQtYWViOS1hZDQwY2YyODA2NzYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiI0MzNkYTg3MC0xNTVhLTRmODUtYjI0ZS0xNTA0NTUxNzdjYTciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInNhbmRib3hfdHJhbnNmZXJzX3JlYWQiLCJzYW5kYm94X2NoYXJnZXNfd3JpdGUiLCJzYW5kYm94X3BheW1lbnRfbWV0aG9kc19yZWFkIiwib2ZmbGluZV9hY2Nlc3MiLCJzYW5kYm94X2JhbGFuY2VzX3JlYWQiLCJkZWZhdWx0LXJvbGVzLWZsdXR0ZXJ3YXZlIiwidW1hX2F1dGhvcml6YXRpb24iLCJzYW5kYm94X3RyYW5zZmVyc193cml0ZSIsInNhbmRib3hfY2hhcmdlc19yZWFkIiwic2FuZGJveF9wYXltZW50X21ldGhvZHNfd3JpdGUiLCJzYW5kYm94X2N1c3RvbWVyc193cml0ZSIsInNhbmRib3hfY3VzdG9tZXJzX3JlYWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTAuMS4xMjUuMTY3IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtNDMzZGE4NzAtMTU1YS00Zjg1LWIyNGUtMTUwNDU1MTc3Y2E3IiwicGFydHlJZCI6IjA4NTNlYWQyLTQ4MTItNDBjMi05YzUwLTVkNjkyZTA4MDUxOSIsImNsaWVudEFkZHJlc3MiOiIxMC4xLjEyNS4xNjciLCJjbGllbnRfaWQiOiI0MzNkYTg3MC0xNTVhLTRmODUtYjI0ZS0xNTA0NTUxNzdjYTcifQ.kw3aNWkSTRGwN1zgWrIGYgmNYUjr2w2p8p8LwuGqnkhvO8qIepvjk6IsVSFFBGcYVtoZSrbMWy6YzqPemXpcqzK-gl9xdDMzFxfqzBfubyje5REf1E_gX_Uj74F1ztal7LBN_Cuz6I4BuCHwqKJvbzktV2gIiaNFHj11DekoOaqFHtKiwhK-aCkZrN6SaLn_bBraSVZWxuCoRvnlzBSdVPl7vWdgKcmNS8nWYLsxBFtheeWh78aSuixbPiiGdaBEZlzlcpnPBiiGQxMbocTzJxSQtjZHPz7B7YpJFH0lvImBuGTv-mB_lD_zFDRf_2JZ5Kul2UYmRrs0UuA9zD4hyw"

# === AES-256 helpers ===
BLOCK_SIZE = 16

def pad(s: str) -> str:
    padding = BLOCK_SIZE - (len(s) % BLOCK_SIZE)
    return s + (chr(padding) * padding)

def encrypt_field(value: str, key: str) -> str:
    if len(key) != 32:
        aes_key = hashlib.md5(key.encode("utf-8")).hexdigest()[:32].encode()
    else:
        aes_key = key.encode()
    cipher = AES.new(aes_key, AES.MODE_ECB)
    encrypted = cipher.encrypt(pad(value).encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

# === Encrypt card details ===
encrypted_card = {
    "encrypted_card_number": encrypt_field("5531886652142950", encryption_key),
    "encrypted_cvv": encrypt_field("564", encryption_key),
    "encrypted_expiry_month": encrypt_field("09", encryption_key),
    "encrypted_expiry_year": encrypt_field("32", encryption_key)
}

# === Generate valid nonce (12 alphanumeric) ===
def generate_nonce(length=12):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# === Build request body ===
data = {
    "amount": 1234.56,
    "currency": "USD",
    "reference": "REF" + ''.join(random.choices(string.digits, k=9)),  # e.g. REF123456789
    "payment_method": {
        "type": "card",
        "card": {
            "nonce": generate_nonce(),
            **encrypted_card
        }
    },
    "redirect_url": "https://google.com",
    "customer": {
        "address": {
            "country": "US",
            "city": "Gotham",
            "state": "Colorado",
            "postal_code": "94105",
            "line1": "221B Baker Street"
        },
        "phone": {
            "country_code": "1",
            "number": "7069423351"
        },
        "name": {
            "first": "King",
            "middle": "Leo",
            "last": "James"
        },
        "email": "james@example.com"
    }
}

# === Endpoint ===
url = "https://api.flutterwave.cloud/developersandbox/orchestration/direct-charges"

# === Send request ===
resp = requests.post(
    url,
    headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    },
    data=json.dumps(data)
)

print("Status Code:", resp.status_code)
try:
    print("Response:", json.dumps(resp.json(), indent=2))
except:
    print("Raw Response:", resp.text)
