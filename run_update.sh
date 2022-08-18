#!/bin/zsh

source .venv/bin/activate
python update.py 1MF4h8nX6nNGVrWVCvaaZ6lHM_3pj6cC_HqmcDB2eGq8_Yd_LhWUpAcMx worktime_logger
deactivate

git --no-pager diff
echo "What have you changed?"
read -r message
git add worktime_logger/*
git commit -a -m"$message"
git push origin
git push td_origin
