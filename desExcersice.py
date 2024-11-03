# الفصل السادس - هندسة برمحيات - تسليم DES- عبدالمنعم عبالرحمن خضر 
# =====================================================================

from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

# Original text to be encrypted
plaintext = "Des algorithm assignment."

plaintext = "sjdfasdjfj."


# 8-byte key
key = b"exercise"  # Ensure the key is 8 bytes long

# Create DES object
cipher = DES.new(key, DES.MODE_ECB)

# Encrypt the text
# The text must be a multiple of 8 bytes for DES encryption
padded_text = pad(plaintext.encode(), DES.block_size)
encrypted_text = cipher.encrypt(padded_text)
print("Encrypted text:", encrypted_text)

# Decrypt the text
decrypted_padded_text = cipher.decrypt(encrypted_text)
decrypted_text = unpad(decrypted_padded_text, DES.block_size).decode()
print("Decrypted text:", decrypted_text)
