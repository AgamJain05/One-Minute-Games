export const GIT_COMMANDS = [
  { question: 'Initialize a new Git repository', options: ['git init', 'git start', 'git new', 'git create'], answer: 'git init' },
  { question: 'Stage all changes', options: ['git add .', 'git stage .', 'git commit -a', 'git push'], answer: 'git add .' },
  { question: 'Commit staged changes', options: ['git commit -m "message"', 'git save', 'git push', 'git add'], answer: 'git commit -m "message"' },
  { question: 'Push to remote repository', options: ['git push', 'git upload', 'git send', 'git sync'], answer: 'git push' },
  { question: 'Pull from remote repository', options: ['git pull', 'git fetch', 'git download', 'git sync'], answer: 'git pull' },
  { question: 'Create a new branch', options: ['git branch name', 'git checkout name', 'git new name', 'git create name'], answer: 'git branch name' },
  { question: 'Switch to a different branch', options: ['git checkout branch', 'git switch branch', 'git branch branch', 'git change branch'], answer: 'git checkout branch' },
  { question: 'Merge a branch', options: ['git merge branch', 'git join branch', 'git combine branch', 'git add branch'], answer: 'git merge branch' },
  { question: 'View commit history', options: ['git log', 'git history', 'git commits', 'git show'], answer: 'git log' },
  { question: 'Check repository status', options: ['git status', 'git info', 'git state', 'git check'], answer: 'git status' },
  { question: 'Clone a repository', options: ['git clone url', 'git copy url', 'git download url', 'git fetch url'], answer: 'git clone url' },
  { question: 'Discard changes in working directory', options: ['git checkout -- file', 'git reset file', 'git undo file', 'git revert file'], answer: 'git checkout -- file' },
  { question: 'Stash current changes', options: ['git stash', 'git save', 'git hide', 'git store'], answer: 'git stash' },
  { question: 'Show diff of unstaged changes', options: ['git diff', 'git compare', 'git changes', 'git show'], answer: 'git diff' },
  { question: 'Delete a branch', options: ['git branch -d name', 'git delete name', 'git remove name', 'git rm name'], answer: 'git branch -d name' },
  { question: 'View remote repositories', options: ['git remote -v', 'git remotes', 'git list remotes', 'git show remote'], answer: 'git remote -v' },
  { question: 'Undo last commit (keep changes)', options: ['git reset HEAD~1', 'git undo', 'git revert HEAD', 'git rm HEAD'], answer: 'git reset HEAD~1' },
  { question: 'Tag a specific commit', options: ['git tag name', 'git label name', 'git mark name', 'git version name'], answer: 'git tag name' },
  { question: 'Fetch changes without merging', options: ['git fetch', 'git pull --no-merge', 'git download', 'git get'], answer: 'git fetch' }
];





