#!/bin/zsh

set -e
source .venv/bin/activate
jq -c '.[]' projects.json | while read i; do
        # Do stuff here
        project_id=$(echo "$i"|jq -r .projectId)
        project_name=$(echo "$i"|jq -r .projectName)
        echo "$project_name: $project_id"
        if [ -d $project_name ];then rm -rf ${project_name:?}/*;fi
        python3 update.py $project_id $project_name
done
deactivate
git --no-pager diff
echo "What have you changed?"
read -r message
jq -c '.[]' projects.json | while read i; do
    project_name=$(echo "$i"|jq -r .projectName)
	git add "$project_name"/*
done
git commit -a -m"$message"
git push origin
git push td_origin
