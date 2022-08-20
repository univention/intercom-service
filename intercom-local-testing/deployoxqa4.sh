#!/bin/bash
rsync -a  -e ssh  --exclude='.*' --exclude='node_modules' . root@ics.dpx-oxqa4.at-univention.de:/opt/intercom
ssh root@ics.dpx-oxqa4.at-univention.de "service intercom restart"
