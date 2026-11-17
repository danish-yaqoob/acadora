# Security policy

Version 0.1.x is the current development line. Security fixes are intended for the latest release; there is no guaranteed response SLA.

Do not put private records, backup files, exploit details, or secrets in public issues. After publication, use GitHub's private vulnerability reporting if enabled. Maintainers must enable that feature or publish a private security contact before inviting vulnerability reports. No private contact is configured in this unpublished source package.

Acadora stores records in browser IndexedDB and timer metadata in localStorage. It is not an encrypted vault or medical-record system. Backups are unencrypted. Origin security, dependency integrity, and device access matter. Restore validates a strict schema and relationships before an atomic replacement. Markdown renders through React without raw HTML support. CSV exports neutralize leading formula characters. Server hosting should use HTTPS and appropriate security headers.
