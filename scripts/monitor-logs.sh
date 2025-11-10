#!/usr/bin/env bash
LOGFILE=${1:-/var/log/petfinder.log}
ALERTFILE=${2:-/var/log/petfinder_alerts.log}
THRESHOLD=${3:-5}

ERRCOUNT=$(tail -n 1000 "$LOGFILE" 2>/dev/null | grep -c ' 500' || echo 0)

if [ "$ERRCOUNT" -ge "$THRESHOLD" ]; then
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") ALERT: High error rate detected: $ERRCOUNT HTTP 500s" >> "$ALERTFILE"
fi

MAX_BYTES=$((10 * 1024 * 1024))
if [ -f "$LOGFILE" ]; then
  size=$(stat -c%s "$LOGFILE")
  if [ "$size" -ge "$MAX_BYTES" ]; then
    ts=$(date +"%Y%m%d%H%M%S")
    mv "$LOGFILE" "${LOGFILE}.${ts}"
    touch "$LOGFILE"
    echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") rotated log ${LOGFILE} to ${LOGFILE}.${ts}" >> "$ALERTFILE"
  fi
fi

