#!/bin/bash
# deferred_install
# Copyright (c) 2017 Apple Inc.

LOG_PATH="/private/var/log/install.log"

RESOURCES_PATH="/System/Library/PrivateFrameworks/PackageKit.framework/Resources"
TOOL_PATH="${RESOURCES_PATH}/deferred_install"

/bin/echo "PackageKit: ----- Begin Deferred Install -----" >> "${LOG_PATH}"

/bin/echo "Date: $(/bin/date)" >> "${LOG_PATH}"
/bin/echo "Uptime: $(/usr/bin/uptime)" >> "${LOG_PATH}"

if [ -x "${TOOL_PATH}" ]; then
    /bin/echo "PackageKit: Executing deferred install tool ${TOOL_PATH}" >> "${LOG_PATH}"
else
    /bin/echo "PackageKit: Deferred install tool ${TOOL_PATH} missing or not executable!" >> "${LOG_PATH}"
    /usr/bin/stat "${TOOL_PATH}" >> "${LOG_PATH}" 2>&1
fi

if "${TOOL_PATH}" >> "${LOG_PATH}" 2>&1; then
    /bin/echo "PackageKit: Deferred Install succeeded." >> "${LOG_PATH}"
else
    /bin/echo "PackageKit: Deferred Install failed." >> "${LOG_PATH}"
fi

/bin/echo "PackageKit: ----- End Deferred Install -----" >> "${LOG_PATH}"

exit 0
