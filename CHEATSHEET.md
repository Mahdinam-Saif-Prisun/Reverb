Music Streaming DBMS – Workflow Cheatsheet

Goal: Keep main stable, work in parallel, PR approval by @Mahdinam-Saif-Prisun.

Branches:
- main = stable branch (protected)
- feature branches = isolated workspaces for each task

Branch Naming:
- feature/<task-name>-<initials>
  Examples:
    feature/login-prisun   (Prisun)
    feature/song-arian     (Arian)
    feature/playlist-mushfiq (Mushfiq)
- fix/<issue-name>-<initials>
- Never push directly to main.

Step-by-Step Workflow:
1. Pull latest main:
   git checkout main
   git pull origin main

2. Create your feature branch:
   git checkout -b feature/<task-name>-<your-initials>

3. Work locally:
   - Add code, SQL, backend/frontend files
   - Stage & commit frequently:
     git add .
     git commit -m "Add <short description>"

4. Push branch to GitHub:
   git push origin feature/<task-name>-<your-initials>

5. Open a Pull Request (PR) to main:
   - Assign @Mahdinam-Saif-Prisun as reviewer
   - Do not merge your own PR

6. Review & merge:
   - @Mahdinam-Saif-Prisun approves PR
   - Merge into main
   - Delete branch after merge:
     git branch -d feature/<task-name>-<your-initials>
     git push origin --delete feature/<task-name>-<your-initials>

7. Update your branch if main changes:
   git checkout <your-branch>
   git pull origin main
   # resolve conflicts if any
   git push origin <your-branch>

ASCII Visual Workflow:

          +------------------+
          |      main        |  <- Protected
          +------------------+
                    ^
                    | Merge via PR (only @Mahdinam-Saif-Prisun approves)
                    |
           +--------------------+
           |  Feature Branches  |
           +--------------------+
           /        |         \
feature/login-prisun  feature/song-arian  feature/playlist-mushfiq
       (Prisun)           (Arian)             (Mushfiq)

Key Notes:
- Always use unique branch names
- PR = permission to merge
- Conflicts are resolved in branch, not main
- Follow this workflow strictly to protect main
