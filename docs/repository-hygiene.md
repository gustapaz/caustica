# Repository hygiene

Stencil's `frontend/.stencil/` is local compiler state and is ignored by Git. It must not be included in source archives. Local environment files, private keys and signing material are also ignored. Generated component keys are not authentication credentials; no key rotation is needed for those compiler identifiers.
