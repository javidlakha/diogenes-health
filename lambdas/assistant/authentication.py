import json
import time
import urllib.request

from jose import jwk, jwt
from jose.utils import base64url_decode

from base.access import AccessDeniedError
from base.resources import get_user_pool_client_id, get_user_pool_id


REGION = "eu-west-1"


def get_user_pool_public_keys(region: str, user_pool_id: str) -> list[dict[str, str]]:
    """Get the public keys used to sign request tokens"""
    keys_url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"
    with urllib.request.urlopen(keys_url) as f:
        response = f.read()
    keys = json.loads(response.decode("utf-8"))["keys"]

    return keys


def authenticate_access_token(token: str) -> dict[str, str]:
    """Authenticates `token`

    Based on https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py
    """
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]

    # Get public keys
    keys = get_user_pool_public_keys(region=REGION, user_pool_id=get_user_pool_id())

    # Search for `kid` in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        raise AccessDeniedError("Public key not found in jwks.json")

    # Construct the public key
    public_key = jwk.construct(keys[key_index])

    # Get the last two sections of the token, message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)

    # Decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    # Verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        raise AccessDeniedError("Signature verification failed")

    # Since we passed the verification, we can now safely use the unverified claims
    claims = jwt.get_unverified_claims(token)

    # Verify token expiration
    if time.time() > claims["exp"]:
        raise AccessDeniedError("Token is expired")

    # Verify audience
    client_id = get_user_pool_client_id()
    if claims["client_id"] != client_id:
        raise AccessDeniedError("Token was not issued for this audience")

    return claims
