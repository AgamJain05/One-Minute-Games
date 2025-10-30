// ===== TERMINAL MASTER: COMPREHENSIVE LEARNING SYSTEM =====
// Multiple modes for lifetime command mastery

// ===== MODE 1: SCENARIO CHALLENGES =====
// Real-world situations that teach WHY you use commands
export const TERMINAL_SCENARIOS = [
  // === BEGINNER SCENARIOS ===
  {
    id: 1,
    level: 'beginner',
    category: 'Navigation',
    situation: '🏠 You just opened a terminal. You want to see what folder you are currently in.',
    question: 'What command shows your current location?',
    answer: 'pwd',
    explanation: '💡 pwd = Print Working Directory. Think: "Please Where am I, Directory?"',
    options: ['pwd', 'cd', 'ls', 'whoami'],
    hint: 'The command literally prints your working directory path',
    realExample: '$ pwd\n/home/username/projects',
    mnemonic: '📍 PWD = "Please Where\'s my Directory?"',
    useCase: 'Essential when you first log in or get lost in the file system'
  },
  {
    id: 2,
    level: 'beginner',
    category: 'Navigation',
    situation: '📂 You\'re in /home/user and want to see all files and folders here.',
    question: 'What command lists everything in the current directory?',
    answer: 'ls',
    explanation: '💡 ls = List. Short for "list". Used constantly to see what\'s around you.',
    options: ['ls', 'dir', 'show', 'list'],
    hint: 'Only 2 letters! It\'s the shortest and most-used command',
    realExample: '$ ls\nDocuments  Downloads  Pictures  Videos',
    mnemonic: '📋 LS = "List Stuff"',
    useCase: 'Use before almost any file operation to see what\'s available'
  },
  {
    id: 3,
    level: 'beginner',
    category: 'Navigation',
    situation: '🚀 You need to move from your current folder into the "projects" folder.',
    question: 'What command changes your current directory?',
    answer: 'cd',
    explanation: '💡 cd = Change Directory. Your teleport command for moving around!',
    options: ['cd', 'mv', 'go', 'move'],
    hint: 'Think of it as your navigation GPS command',
    realExample: '$ cd projects\n$ pwd\n/home/user/projects',
    mnemonic: '🚗 CD = "Change Direction" (like changing lanes)',
    useCase: 'Used every time you need to work in a different folder'
  },
  {
    id: 4,
    level: 'beginner',
    category: 'File Creation',
    situation: '📁 You need to create a new folder called "my-app" for your project.',
    question: 'What command creates a new directory?',
    answer: 'mkdir',
    explanation: '💡 mkdir = Make Directory. Creates a new folder.',
    options: ['mkdir', 'mkfolder', 'newfolder', 'create'],
    hint: 'It\'s "make" + "directory" shortened',
    realExample: '$ mkdir my-app\n$ ls\nmy-app',
    mnemonic: '🏗️ MKDIR = "Make DIRectory"',
    useCase: 'Every time you start a new project or organize files'
  },
  {
    id: 5,
    level: 'beginner',
    category: 'File Creation',
    situation: '📄 You need to create an empty file called "README.md".',
    question: 'What command creates an empty file?',
    answer: 'touch',
    explanation: '💡 touch = Creates an empty file or updates timestamp. Think: "touching" a file into existence!',
    options: ['touch', 'create', 'new', 'make'],
    hint: 'An unusual name! You "touch" files to create them',
    realExample: '$ touch README.md\n$ ls\nREADME.md',
    mnemonic: '👆 TOUCH = Like touching paper to create a blank page',
    useCase: 'Quick way to create config files, READMEs, or placeholder files'
  },

  // === INTERMEDIATE SCENARIOS ===
  {
    id: 6,
    level: 'intermediate',
    category: 'File Operations',
    situation: '📋 You want to see the contents of "config.txt" without opening an editor.',
    question: 'What command displays file contents in the terminal?',
    answer: 'cat',
    explanation: '💡 cat = ConCATenate. Shows file contents. Named after concatenating files together.',
    options: ['cat', 'show', 'read', 'view'],
    hint: 'Named after a cute animal! 🐱',
    realExample: '$ cat config.txt\nserver=localhost\nport=3000',
    mnemonic: '🐱 CAT = "Content At Terminal"',
    useCase: 'Quick way to read config files, logs, or check file contents'
  },
  {
    id: 7,
    level: 'intermediate',
    category: 'File Operations',
    situation: '📦 You need to make a copy of "backup.txt" named "backup-old.txt".',
    question: 'What command copies files?',
    answer: 'cp',
    explanation: '💡 cp = CoPy. Makes duplicates of files or folders.',
    options: ['cp', 'copy', 'duplicate', 'clone'],
    hint: 'Short for "copy"',
    realExample: '$ cp backup.txt backup-old.txt\n$ ls\nbackup.txt  backup-old.txt',
    mnemonic: '📑 CP = "CoPy"',
    useCase: 'Backup files before editing, duplicate configs, archive versions'
  },
  {
    id: 8,
    level: 'intermediate',
    category: 'File Operations',
    situation: '🔄 You want to rename "old-name.js" to "new-name.js".',
    question: 'What command moves OR renames files?',
    answer: 'mv',
    explanation: '💡 mv = MoVe. Moves files to new location OR renames them (same command!)',
    options: ['mv', 'rename', 'move', 'rn'],
    hint: 'It "moves" files to a new name or location',
    realExample: '$ mv old-name.js new-name.js\n$ ls\nnew-name.js',
    mnemonic: '🚚 MV = "MoVe" (works for renaming too!)',
    useCase: 'Renaming files, organizing files into folders, refactoring'
  },
  {
    id: 9,
    level: 'intermediate',
    category: 'File Operations',
    situation: '🗑️ You need to delete an unwanted file "junk.txt".',
    question: 'What command removes/deletes files?',
    answer: 'rm',
    explanation: '💡 rm = ReMove. CAREFUL! This permanently deletes files (no recycle bin).',
    options: ['rm', 'del', 'delete', 'remove'],
    hint: 'Short for "remove". Be careful with this one!',
    realExample: '$ rm junk.txt\n$ ls\n(junk.txt is gone)',
    mnemonic: '⚠️ RM = "ReMove" (DANGER: No undo!)',
    useCase: 'Cleaning up temp files, removing old code, deleting logs'
  },
  {
    id: 10,
    level: 'intermediate',
    category: 'Search',
    situation: '🔍 You need to find all files named "config.js" anywhere in your project.',
    question: 'What command searches for files by name?',
    answer: 'find',
    explanation: '💡 find = Searches for files/folders by name, size, date, etc. Your file detective!',
    options: ['find', 'search', 'locate', 'where'],
    hint: 'Exactly what it says - finds things!',
    realExample: '$ find . -name "config.js"\n./src/config.js\n./tests/config.js',
    mnemonic: '🔎 FIND = Your filesystem detective',
    useCase: 'Lost files, finding duplicates, batch operations on specific files'
  },

  // === ADVANCED SCENARIOS ===
  {
    id: 11,
    level: 'advanced',
    category: 'Search',
    situation: '📝 You need to search for the word "API_KEY" in all .js files in your project.',
    question: 'What command searches for text INSIDE files?',
    answer: 'grep',
    explanation: '💡 grep = Global Regular Expression Print. Searches file contents for patterns.',
    options: ['grep', 'find', 'search', 'locate'],
    hint: 'Strange name! It searches INSIDE files, not file names',
    realExample: '$ grep "API_KEY" *.js\nconfig.js: const API_KEY = "abc123"',
    mnemonic: '📄 GREP = "Get Regular Expression Pattern" (searches text)',
    useCase: 'Finding code references, searching logs, debugging'
  },
  {
    id: 12,
    level: 'advanced',
    category: 'Permissions',
    situation: '🔐 You need to make a script file "deploy.sh" executable so you can run it.',
    question: 'What command changes file permissions?',
    answer: 'chmod',
    explanation: '💡 chmod = CHange MODe. Changes who can read, write, or execute files.',
    options: ['chmod', 'chown', 'perms', 'access'],
    hint: 'You\'re changing the "mode" (permissions) of the file',
    realExample: '$ chmod +x deploy.sh\n$ ./deploy.sh\n(script runs)',
    mnemonic: '🔑 CHMOD = "CHange MODe" (permission mode)',
    useCase: 'Making scripts executable, securing files, fixing permission errors'
  },
  {
    id: 13,
    level: 'advanced',
    category: 'System',
    situation: '💾 Your disk is full! You need to see how much space is available.',
    question: 'What command shows disk space usage?',
    answer: 'df',
    explanation: '💡 df = Disk Free. Shows how much space is free/used on all drives.',
    options: ['df', 'du', 'disk', 'space'],
    hint: 'Think "Disk Free" space',
    realExample: '$ df -h\nFilesystem      Size  Used Avail\n/dev/sda1       100G   80G   20G',
    mnemonic: '💿 DF = "Disk Free" space',
    useCase: 'Debugging "disk full" errors, monitoring server space'
  },
  {
    id: 14,
    level: 'advanced',
    category: 'System',
    situation: '🐌 Your app is slow. You need to see what processes are running and using CPU.',
    question: 'What command shows running processes?',
    answer: 'ps',
    explanation: '💡 ps = Process Status. Lists all running programs and their resource usage.',
    options: ['ps', 'top', 'tasks', 'proc'],
    hint: 'Short for "process status"',
    realExample: '$ ps aux\nUSER       PID  %CPU %MEM COMMAND\nroot      1234  50.0  10.0 node app.js',
    mnemonic: '⚙️ PS = "Process Status"',
    useCase: 'Finding resource hogs, killing frozen apps, debugging performance'
  },
  {
    id: 15,
    level: 'advanced',
    category: 'Networking',
    situation: '⬇️ You need to download a file from a URL into your current directory.',
    question: 'What command downloads files from the internet?',
    answer: 'wget',
    explanation: '💡 wget = Web GET. Downloads files from URLs. Like a command-line download manager.',
    options: ['wget', 'curl', 'download', 'get'],
    hint: 'It "gets" stuff from the web',
    realExample: '$ wget https://example.com/file.zip\nDownloading... 100%',
    mnemonic: '🌐 WGET = "Web GET"',
    useCase: 'Downloading installers, APIs, batch downloading, automation'
  }
];

// ===== MODE 2: COMMAND BUILDER CHALLENGES =====
// Learn to construct complex commands with flags and pipes
export const COMMAND_BUILDER_CHALLENGES = [
  {
    id: 1,
    level: 'beginner',
    scenario: 'Show detailed information about all files (including hidden ones) in the current directory',
    commandParts: [
      { text: 'ls', type: 'command', required: true },
      { text: '-l', type: 'flag', required: true, meaning: 'long format (detailed)' },
      { text: '-a', type: 'flag', required: true, meaning: 'all files (including hidden)' },
      { text: '-h', type: 'flag', required: false, meaning: 'human-readable sizes' }
    ],
    correctCommand: 'ls -la',
    alternativeCommands: ['ls -l -a', 'ls -al', 'ls -lah'],
    explanation: '-l shows details, -a shows hidden files (starting with .)',
    commonMistake: 'Forgetting -a means you won\'t see hidden files like .gitignore',
    tip: '💡 Combine flags: -la is the same as -l -a'
  },
  {
    id: 2,
    level: 'beginner',
    scenario: 'Change to the parent directory (go up one level)',
    commandParts: [
      { text: 'cd', type: 'command', required: true },
      { text: '..', type: 'path', required: true, meaning: 'parent directory' }
    ],
    correctCommand: 'cd ..',
    alternativeCommands: ['cd ..'],
    explanation: '.. is a special path meaning "parent directory" (one level up)',
    commonMistake: 'Typing "cd.." without a space won\'t work',
    tip: '💡 . = current directory, .. = parent directory, ~ = home directory'
  },
  {
    id: 3,
    level: 'intermediate',
    scenario: 'Find all JavaScript files in the current directory and subdirectories',
    commandParts: [
      { text: 'find', type: 'command', required: true },
      { text: '.', type: 'path', required: true, meaning: 'current directory' },
      { text: '-name', type: 'flag', required: true, meaning: 'search by filename' },
      { text: '"*.js"', type: 'pattern', required: true, meaning: 'files ending in .js' }
    ],
    correctCommand: 'find . -name "*.js"',
    alternativeCommands: ['find . -name \'*.js\''],
    explanation: 'find searches recursively, . means start here, -name searches filenames',
    commonMistake: 'Forgetting quotes around *.js can cause shell expansion issues',
    tip: '💡 find is recursive by default - it searches ALL subdirectories'
  },
  {
    id: 4,
    level: 'intermediate',
    scenario: 'Search for the word "TODO" in all files in the current directory',
    commandParts: [
      { text: 'grep', type: 'command', required: true },
      { text: '-r', type: 'flag', required: true, meaning: 'recursive (all subdirectories)' },
      { text: '-n', type: 'flag', required: false, meaning: 'show line numbers' },
      { text: '"TODO"', type: 'pattern', required: true, meaning: 'text to search for' },
      { text: '.', type: 'path', required: true, meaning: 'current directory' }
    ],
    correctCommand: 'grep -r "TODO" .',
    alternativeCommands: ['grep -rn "TODO" .', 'grep -r TODO .'],
    explanation: 'grep searches file contents, -r makes it recursive',
    commonMistake: 'Forgetting -r only searches current directory, not subdirectories',
    tip: '💡 Add -n to see line numbers where matches are found'
  },
  {
    id: 5,
    level: 'intermediate',
    scenario: 'Copy an entire directory "src" to "src-backup" including all contents',
    commandParts: [
      { text: 'cp', type: 'command', required: true },
      { text: '-r', type: 'flag', required: true, meaning: 'recursive (copy folders)' },
      { text: 'src', type: 'source', required: true },
      { text: 'src-backup', type: 'destination', required: true }
    ],
    correctCommand: 'cp -r src src-backup',
    alternativeCommands: ['cp -R src src-backup'],
    explanation: 'cp alone only copies files, -r is needed for directories',
    commonMistake: 'Forgetting -r gives an error: "omitting directory"',
    tip: '💡 -r means "recursive" - copy everything inside too'
  },
  {
    id: 6,
    level: 'advanced',
    scenario: 'Count the number of JavaScript files in your project',
    commandParts: [
      { text: 'find', type: 'command', required: true },
      { text: '.', type: 'path', required: true },
      { text: '-name', type: 'flag', required: true },
      { text: '"*.js"', type: 'pattern', required: true },
      { text: '|', type: 'pipe', required: true, meaning: 'pass output to next command' },
      { text: 'wc', type: 'command', required: true, meaning: 'word count' },
      { text: '-l', type: 'flag', required: true, meaning: 'count lines' }
    ],
    correctCommand: 'find . -name "*.js" | wc -l',
    alternativeCommands: [],
    explanation: '| (pipe) sends find output to wc, which counts the lines (files)',
    commonMistake: 'Not understanding pipes - they connect commands together',
    tip: '💡 Pipes | are POWERFUL - learn to chain commands!'
  },
  {
    id: 7,
    level: 'advanced',
    scenario: 'Show the 10 largest files in the current directory',
    commandParts: [
      { text: 'ls', type: 'command', required: true },
      { text: '-lS', type: 'flag', required: true, meaning: 'long format, sorted by Size' },
      { text: '|', type: 'pipe', required: true },
      { text: 'head', type: 'command', required: true, meaning: 'show first lines' },
      { text: '-10', type: 'number', required: true, meaning: 'first 10 lines' }
    ],
    correctCommand: 'ls -lS | head -10',
    alternativeCommands: ['ls -lS | head -n 10'],
    explanation: '-S sorts by size (largest first), head shows first 10',
    commonMistake: 'Forgetting to sort means head shows alphabetically, not by size',
    tip: '💡 -S = Sort by size, -t = sort by time'
  },
  {
    id: 8,
    level: 'advanced',
    scenario: 'Find all "node_modules" directories and delete them to free space',
    commandParts: [
      { text: 'find', type: 'command', required: true },
      { text: '.', type: 'path', required: true },
      { text: '-name', type: 'flag', required: true },
      { text: '"node_modules"', type: 'pattern', required: true },
      { text: '-type', type: 'flag', required: true },
      { text: 'd', type: 'option', required: true, meaning: 'directories only' },
      { text: '-exec', type: 'flag', required: true, meaning: 'execute command on results' },
      { text: 'rm', type: 'command', required: true },
      { text: '-rf', type: 'flag', required: true, meaning: 'recursive force delete' },
      { text: '{}', type: 'placeholder', required: true, meaning: 'found item' },
      { text: ';', type: 'terminator', required: true }
    ],
    correctCommand: 'find . -name "node_modules" -type d -exec rm -rf {} ;',
    alternativeCommands: ['find . -name "node_modules" -type d -exec rm -rf {} \\;'],
    explanation: 'find locates folders, -exec runs rm on each result, {} is placeholder',
    commonMistake: 'DANGEROUS! Test with -exec ls {} ; first to see what will be deleted',
    tip: '⚠️ ALWAYS test destructive commands first! Replace rm with ls to preview'
  }
];

// ===== MODE 3: QUICK FIRE CHALLENGES =====
// Fast recall for command mastery
export const QUICK_FIRE_COMMANDS = [
  { cmd: 'pwd', meaning: 'Print Working Directory', useCase: 'Show current location' },
  { cmd: 'ls', meaning: 'List', useCase: 'Show files and folders' },
  { cmd: 'cd', meaning: 'Change Directory', useCase: 'Navigate to another folder' },
  { cmd: 'mkdir', meaning: 'Make Directory', useCase: 'Create a new folder' },
  { cmd: 'touch', meaning: 'Touch (create)', useCase: 'Create an empty file' },
  { cmd: 'cat', meaning: 'Concatenate', useCase: 'View file contents' },
  { cmd: 'cp', meaning: 'Copy', useCase: 'Duplicate files or folders' },
  { cmd: 'mv', meaning: 'Move', useCase: 'Move or rename files' },
  { cmd: 'rm', meaning: 'Remove', useCase: 'Delete files (CAREFUL!)' },
  { cmd: 'find', meaning: 'Find', useCase: 'Search for files by name' },
  { cmd: 'grep', meaning: 'Global Regular Expression Print', useCase: 'Search text inside files' },
  { cmd: 'chmod', meaning: 'Change Mode', useCase: 'Change file permissions' },
  { cmd: 'chown', meaning: 'Change Owner', useCase: 'Change file owner' },
  { cmd: 'ps', meaning: 'Process Status', useCase: 'Show running processes' },
  { cmd: 'kill', meaning: 'Kill (terminate)', useCase: 'Stop a running process' },
  { cmd: 'df', meaning: 'Disk Free', useCase: 'Show disk space' },
  { cmd: 'du', meaning: 'Disk Usage', useCase: 'Show folder sizes' },
  { cmd: 'top', meaning: 'Table of Processes', useCase: 'Monitor system resources live' },
  { cmd: 'wget', meaning: 'Web Get', useCase: 'Download files from URLs' },
  { cmd: 'curl', meaning: 'Client URL', useCase: 'Transfer data from URLs' },
  { cmd: 'tar', meaning: 'Tape Archive', useCase: 'Compress/extract archives' },
  { cmd: 'zip', meaning: 'Zip', useCase: 'Create zip archives' },
  { cmd: 'unzip', meaning: 'Unzip', useCase: 'Extract zip archives' },
  { cmd: 'ssh', meaning: 'Secure Shell', useCase: 'Connect to remote servers' },
  { cmd: 'scp', meaning: 'Secure Copy', useCase: 'Copy files to/from remote servers' }
];

// ===== MODE 4: COMMAND COMBINATION MASTERY =====
// Real-world complex command sequences
export const COMMAND_SEQUENCES = [
  {
    id: 1,
    task: 'Create a new project structure',
    description: 'Create a folder "my-app", enter it, and create src, public, and tests folders',
    steps: [
      { command: 'mkdir my-app', explanation: 'Create project root' },
      { command: 'cd my-app', explanation: 'Enter the project' },
      { command: 'mkdir src public tests', explanation: 'Create multiple folders at once' }
    ],
    oneLineSolution: 'mkdir my-app && cd my-app && mkdir src public tests',
    tip: '💡 && chains commands - next runs only if previous succeeds',
    category: 'Project Setup'
  },
  {
    id: 2,
    task: 'Find and remove all log files',
    description: 'Find all .log files and delete them safely',
    steps: [
      { command: 'find . -name "*.log"', explanation: 'First, list all log files (ALWAYS preview first!)' },
      { command: 'find . -name "*.log" -delete', explanation: 'Then delete them' }
    ],
    oneLineSolution: 'find . -name "*.log" -delete',
    tip: '⚠️ ALWAYS run without -delete first to preview what will be removed!',
    category: 'Cleanup'
  },
  {
    id: 3,
    task: 'Search for API keys in code',
    description: 'Find all files containing "API_KEY" or "SECRET" in your project',
    steps: [
      { command: 'grep -r "API_KEY" .', explanation: 'Search for API_KEY' },
      { command: 'grep -r "SECRET" .', explanation: 'Search for SECRET' }
    ],
    oneLineSolution: 'grep -r -E "API_KEY|SECRET" .',
    tip: '💡 -E enables extended regex, | means OR',
    category: 'Security Audit'
  },
  {
    id: 4,
    task: 'Backup before making changes',
    description: 'Create a timestamped backup of your entire src folder',
    steps: [
      { command: 'tar -czf src-backup-$(date +%Y%m%d).tar.gz src', explanation: 'Compress src with current date' }
    ],
    oneLineSolution: 'tar -czf src-backup-$(date +%Y%m%d).tar.gz src',
    tip: '💡 $(date +%Y%m%d) inserts current date: 20241024',
    category: 'Backup'
  },
  {
    id: 5,
    task: 'Clean node_modules everywhere',
    description: 'Remove all node_modules folders to free disk space',
    steps: [
      { command: 'find . -name "node_modules" -type d', explanation: 'Preview what will be deleted' },
      { command: 'find . -name "node_modules" -type d -exec rm -rf {} +', explanation: 'Delete all found' }
    ],
    oneLineSolution: 'find . -name "node_modules" -type d -prune -exec rm -rf {} +',
    tip: '⚠️ This can delete GIGABYTES! Always preview first!',
    category: 'Cleanup'
  }
];

// ===== MNEMONIC HELPERS =====
export const COMMAND_MNEMONICS = {
  'pwd': { mnemonic: 'Please Where\'s my Directory?', visual: '📍', story: 'You\'re lost and asking "Please, where\'s my directory?"' },
  'ls': { mnemonic: 'List Stuff', visual: '📋', story: 'Making a shopping list of stuff in your folder' },
  'cd': { mnemonic: 'Change Direction', visual: '🚗', story: 'Changing lanes/direction while driving' },
  'mkdir': { mnemonic: 'Make DIRectory', visual: '🏗️', story: 'Construction crew making a directory building' },
  'touch': { mnemonic: 'Touch paper to create it', visual: '👆', story: 'Touching a blank piece of paper' },
  'cat': { mnemonic: 'Content At Terminal', visual: '🐱', story: 'A cat delivering content to you' },
  'cp': { mnemonic: 'CoPy', visual: '📑', story: 'Copy machine duplicating paper' },
  'mv': { mnemonic: 'MoVe (or rename)', visual: '🚚', story: 'Moving truck relocating your files' },
  'rm': { mnemonic: 'ReMove (DANGER!)', visual: '⚠️', story: 'Red "REMOVE" button - no undo!' },
  'grep': { mnemonic: 'Get REgular exPression', visual: '🔍', story: 'Detective with magnifying glass searching text' },
  'find': { mnemonic: 'Find (detective)', visual: '🕵️', story: 'Detective finding hidden files' },
  'chmod': { mnemonic: 'CHange MODe', visual: '🔑', story: 'Changing the lock mode on a door' },
  'ps': { mnemonic: 'Process Status', visual: '⚙️', story: 'Status dashboard showing running processes' },
  'df': { mnemonic: 'Disk Free', visual: '💾', story: 'Checking how much free space on disk' },
  'wget': { mnemonic: 'Web GET', visual: '⬇️', story: 'Getting stuff from the web' },
  'tar': { mnemonic: 'Tape ARchive', visual: '📦', story: 'Old tape backup archive (like zip)' }
};

// ===== LEARNING PATHS =====
export const LEARNING_PATHS = [
  {
    name: 'Absolute Beginner',
    description: 'Never used terminal before',
    commands: ['pwd', 'ls', 'cd', 'mkdir', 'touch'],
    estimatedTime: '10 minutes',
    goal: 'Navigate and create files'
  },
  {
    name: 'File Operations',
    description: 'Manage files like a pro',
    commands: ['cat', 'cp', 'mv', 'rm', 'find'],
    estimatedTime: '15 minutes',
    goal: 'Copy, move, delete, search files'
  },
  {
    name: 'Advanced Search',
    description: 'Find anything instantly',
    commands: ['grep', 'find', 'locate', 'which'],
    estimatedTime: '15 minutes',
    goal: 'Master searching'
  },
  {
    name: 'System Administration',
    description: 'Control your system',
    commands: ['ps', 'kill', 'df', 'du', 'chmod', 'chown'],
    estimatedTime: '20 minutes',
    goal: 'Manage processes and permissions'
  },
  {
    name: 'Power User',
    description: 'Pipes, chains, and automation',
    commands: ['|', '&&', '>', '>>', 'xargs', 'awk', 'sed'],
    estimatedTime: '25 minutes',
    goal: 'Combine commands for power'
  }
];

export default {
  scenarios: TERMINAL_SCENARIOS,
  builders: COMMAND_BUILDER_CHALLENGES,
  quickFire: QUICK_FIRE_COMMANDS,
  sequences: COMMAND_SEQUENCES,
  mnemonics: COMMAND_MNEMONICS,
  paths: LEARNING_PATHS
};
