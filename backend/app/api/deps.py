# Stage 3 adds real Firebase ID-token verification here (via firebase-admin),
# plus a role-checking dependency for admin / verification_officer / data_entry_operator.
# Left as a stub now so route files can import a stable name from day one.

def get_current_user():
    raise NotImplementedError("Firebase auth dependency lands in Stage 3")
