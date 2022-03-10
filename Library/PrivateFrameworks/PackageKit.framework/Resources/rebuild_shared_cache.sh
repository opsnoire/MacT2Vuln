#!/bin/bash
# rc.installer_cleanup
# Copyright (c) 2017 Apple Inc.

LOG_PATH="/private/var/log/install.log"
TOOL_PATH="/usr/bin/update_dyld_shared_cache"

/bin/echo "PackageKit: ----- Begin Shared Cache Rebuild -----" >> "${LOG_PATH}"

/bin/echo "Date: $(/bin/date)" >> "${LOG_PATH}"
/bin/echo "Uptime: $(/usr/bin/uptime)" >> "${LOG_PATH}"

if [ -x "${TOOL_PATH}" ]; then
    /bin/echo "PackageKit: Executing Rebuild tool ${TOOL_PATH}" >> "${LOG_PATH}"
else
    /bin/echo "PackageKit: Rebuild tool ${TOOL_PATH} missing or not executable!" >> "${LOG_PATH}"
    /usr/bin/stat "${TOOL_PATH}" >> "${LOG_PATH}" 2>&1
fi

if "${TOOL_PATH}" -root / >> "${LOG_PATH}" 2>&1; then
    /bin/echo "PackageKit: Rebuild succeeded." >> "${LOG_PATH}"
else
    /bin/echo "PackageKit: Rebuild failed." >> "${LOG_PATH}"
fi

# /etc instead of /private/etc to match the path launchd uses
/bin/rm -f /etc/rc.installer_cleanup >> "${LOG_PATH}" 2>&1

/bin/echo "PackageKit: ----- End Shared Cache Rebuild -----" >> "${LOG_PATH}"

exit 0
