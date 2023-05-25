#!/bin/zsh

set -e
update_projects() {
  setopt +o nomatch
  source .venv/bin/activate
  jq -c '.[]' projects.json | while read i; do
          # Do stuff here
          project_id=$(echo "$i"|jq -r .projectId)
          project_name=$(echo "$i"|jq -r .projectName)
          echo "$project_name: $project_id"
          # https://unix.stackexchange.com/questions/310540/how-to-get-rid-of-no-match-found-when-running-rm
          if [ -d $project_name ];then rm -rf ${project_name:?}/*;fi
          python3 update.py $project_id $project_name
  done
  deactivate
}

git_push() {
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
}

while getopts ugh flag
do
    case "${flag}" in
        u) update_projects;;
        g) git_push;;
        h) echo "usage: $0 [-h|-u|-g]"
           printf "\t\t\t-h - help\n"
           printf "\t\t\t-u - update projects\n"
           printf "\t\t\t-g - push into git\n"
          ;;
        *) exit 1;;
    esac
done
