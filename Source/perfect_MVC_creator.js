const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const completed = (msg) => {
    console.log(msg);
    rl.question('The process seems to have completed successfully - press Enter to close', () => {
        rl.close();
    });
};

rl.question("Enter the project name : ", function(projName) {
    rl.question("Enter the database name (DB_NAME): ", function(dbName) {
        rl.question("MariaDb or Mysql : (default: 3307 (Maria)) ", function(dbPortal) {
            const dbPort = dbPortal || 3307;
            rl.question("Enter Git Repository URL to automatically create remote address (default: no) ", function(git) {
                const gitRep = git || false;




                completed(" - All done!");

            });
        });
    });
});

// pkg Source/perfect_MVC_creator.js --targets node18-win-x64 --output Perfect_MVC_Creator.exe