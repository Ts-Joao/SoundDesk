import hashlib


def hash_token(token):
    token = str(token)
    return hashlib.sha256(token.encode('utf-8')).hexdigest()