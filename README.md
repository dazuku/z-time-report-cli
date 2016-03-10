Z-Time Report CLI
=====================

Project to create a CLI for report time in Zemoga when user made commits from projects

## 1. Projects
Command to see all the projects
```
zproject ls
```
and the next command to see the todo items of the selected project
```
zproject {project_id}
```

## 2. Config
This command is for config the personal global variables
```
zconfig -p {personId} -t {todoItemId} -l {protocol} -k {personalToken} -d {domain}
```
#### options
+ `-l`, `--protocol`: Protocol (http:// or https://)
+ `-k`, `--token`: Go to basecamp > My info > Show your tokens > Copy 'Token for feed readers or the Basecamp API'
+ `-d`, `--domain`: Domain basecamp (e.g my-awesome-company.basecamphq.com)
+ `-t`, `--todo`: The ID of the todo item, you can find the ID with zproject command
+ `-p`, `--person`: The ID of the person

## 3. Get all the commits
Get all commits you have made in the day
```
zlist
```

## 4. Commit
Made a commit and save in the list of commits of the day
### GIT
```
zgit commit -m "your msg"
```
### SVN
```
zsvn commit -m "your msg"
```

#### options
+ `-zm`, `--zmesssage`: Use different message for the commit
+ `-zi`, `--zignore`: Ignore the commit for time report
+ `-zt`, `--ztime`: Set the time you report in basecamp
+ `-zd`, `--ztodo`: Set specific todo item ID


## 5. Upload changes to basecamp
Command to upload all the items inside the list of commits of the day
```
zupload
```
