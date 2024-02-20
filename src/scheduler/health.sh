#!/bin/bash

if [ ! -f "lastrun.txt" ]; then
    echo "FAIL: lastrun.txt does not exist."
    exit 1
fi

lastrun=`cat lastrun.txt`
age=$((`date +%s`-$lastrun))

if [ $age -gt 600 ]; then
    echo "FAIL: lastrun.txt has not been updated in over 10 minutes."
    exit 1
else
    echo "PASS: lastrun.txt was updated $((`date +%s`-$lastrun)) seconds ago."
    exit 0
fi
