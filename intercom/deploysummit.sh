#!/bin/bash
rsync -a  -e ssh  --exclude='.*' --exclude='node_modules' . root@ics.dpx-summit.at-univention.de:/opt/intercom
ssh root@ics.dpx-summit.at-univention.de "service intercom restart"
