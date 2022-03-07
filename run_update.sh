#!/bin/zsh

source .venv/bin/activate
python update.py src
deactivate

git --no-pager diff
echo "What have you changed?"
read -r message
git add src/*.gs
git add src/*.html
git commit -a -m"$message"
git push origin
git push td_origin
