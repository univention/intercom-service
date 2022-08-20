#!/bin/bash
rsync -a  -e ssh  --exclude='.*' --exclude='node_modules' . root@ics.dpx-showroom.at-univention.de:/opt/intercom
ssh root@ics.dpx-showroom.at-univention.de "service intercom restart"
