Music Streaming DBMS – Contribution Rules

All contributions must follow these rules to keep the main branch stable and maintain code quality.

1. Branching Rules
- Always create a new branch for your work.
- Branch name format:
  feature/<task-name>-<your-initials>
  fix/<issue-name>-<your-initials>
  Examples:
  - feature/login-prisun  (Prisun)
  - feature/song-arian    (Arian)
  - feature/playlist-mushfiq (Mushfiq)
- Never commit directly to main.

2. Workflow
1. Pull the latest main branch:
   git checkout main
   git pull origin main
2. Create your branch:
   git checkout -b feature/<task-name>-<your-initials>
3. Work locally in your branch (code, SQL, frontend/backend).
4. Stage & commit changes frequently:
   git add .
   git commit -m "Add <short description>"
5. Push your branch to GitHub:
   git push origin feature/<task-name>-<your-initials>
6. Open a Pull Request (PR) targeting main → assign @Mahdinam-Saif-Prisun for review.

3. Pull Request Rules
- Do not merge your own PR.
- PR must be approved by @Prisun before merging.
- If main has updated since you branched, update your branch before merging:
   git checkout <your-branch>
   git pull origin main
   # resolve conflicts if any
   git push origin <your-branch>

4. Commit Message Guidelines
- Use concise, descriptive messages.
- Examples:
  - Add login page UI
  - Create song table schema
  - Fix typo in playlist table

5. Other Rules
- Never push secrets (passwords, API keys) to GitHub.
- Document new dependencies and add to package.json if applicable.
- Use .env.example for environment variables.

6. Workflow Cheatsheet (Visual)
          +------------------+
          |      main        |  <- Protected
          +------------------+
                    ^
                    | Merge via PR (only @Prisun can approve)
                    |
           +--------------------+
           |  Feature Branches  |
           +--------------------+
           /        |         \
feature/login-prisun  feature/song-arian  feature/playlist-mushfiq
       (Prisun)           (Arian)             (Mushfiq)

Workflow Steps:
1. Pull latest main
2. Create unique feature branch
3. Code locally
4. Commit & push branch
5. Open PR → assign @Mahdinam-Saif-Prisun
6. Review → Merge → Delete branch
7. Others update branches from main as needed

7. Summary
- main = stable (protected)
- Feature branches = your workspace
- PR = permission to merge
- @Prisun = gatekeeper of main
- Follow these rules strictly: main only receives reviewed code.
