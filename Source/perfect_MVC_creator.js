const readline = require('readline');
const {execSync} = require('child_process');
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

rl.question("Enter the project name : ", function (projName) {
    rl.question("Enter the database name (DB_NAME): ", function (dbName) {
        rl.question("MariaDb or Mysql : (default: 3307 (Maria)) ", function (dbPortal) {
            const dbPort = dbPortal || 3307;
            rl.question("Enter Git Repository URL to automatically create remote address (default: no) ", function (git) {
                const gitRep = git || false;

                try {
                    // Create all directories under the project name
                    fs.mkdirSync(`${projName}`);
                    fs.mkdirSync(`${projName}/Controllers`);
                    fs.mkdirSync(`${projName}/Controllers/Abstract`);
                    fs.mkdirSync(`${projName}/data`);
                    fs.mkdirSync(`${projName}/model`);
                    fs.mkdirSync(`${projName}/model/Abstract`);
                    fs.mkdirSync(`${projName}/model/Interface`);
                    fs.mkdirSync(`${projName}/model/Manager`);
                    fs.mkdirSync(`${projName}/model/Mapping`);
                    fs.mkdirSync(`${projName}/model/Trait`);
                    fs.mkdirSync(`${projName}/factory`);
                    fs.mkdirSync(`${projName}/public`);
                    fs.mkdirSync(`${projName}/view`);
                    fs.mkdirSync(`${projName}/public/images`);
                    fs.mkdirSync(`${projName}/public/scripts`);
                    fs.mkdirSync(`${projName}/public/styles`);
                    fs.mkdirSync(`${projName}/view/private`);
                    fs.mkdirSync(`${projName}/view/public`);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }

                function createReadmeInFolders(folders) {
                    folders.forEach(folder => {
                        try {
                            if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
                                const folderName = path.basename(folder);
                                const readmeContent = `# Placeholder for ${folderName}`;

                                fs.writeFileSync(path.join(folder, 'README.md'), readmeContent);
                                console.log(`Created README.md in ${folder}`);
                            }
                        } catch (error) {
                            console.error(`Error processing folder ${folder}: ${error.message}`);
                        }
                    });
                }

                createReadmeInFolders([
                    `${projName}/Controllers`,
                    `${projName}/data`,
                    `${projName}/model`,
                    `${projName}/model/Abstract`,
                    `${projName}/model/Interface`,
                    `${projName}/model/Manager`,
                    `${projName}/model/Mapping`,
                    `${projName}/model/Trait`,
                    `${projName}/factory`,
                    `${projName}/public`,
                    `${projName}/public/images`,
                    `${projName}/public/scripts`,
                    `${projName}/public/styles`,
                    `${projName}/view`,
                    `${projName}/view/private`,
                    `${projName}/view/public`
                ]);
                try {
                    const extIndex = `<?php
    header("Location: public");
    die();
            `;
                    fs.writeFileSync(`${projName}/index.php`, extIndex);
                } catch (error) {
                    console.error(error);
                }
try {
    const gitIgnore = `.idea
/vendor
/node_modules
config.php
`;
    fs.writeFileSync(`${projName}/.gitignore`, gitIgnore);
}catch (error) {
                    console.error(error);
}
                try {

                    // ...base.twig
                    const baseTwig = `<\!DOCTYPE html>
<html lang="{% block lang %}fr{% endblock %}">
<head>
    {% block head %}
        {% block meta %}
        {% endblock %}
        <title>{% block title %}{% endblock %}</title>
        {% block stylesheet %}{% endblock %}
    {% endblock %}
</head>
<body class={% block bodyClass %}{% endblock %}>{% block body %}
{% block systemMessage %}{% endblock %}
{% block dumpArea %}{% endblock %}
{% block navBar %}
    {% block connectBtn %} {% endblock %}
{% endblock %}

{% block content %}
    {% block hero %}
        {% block heroText %}{% endblock %}
        {% block heroImg  %}{% endblock %}
    {% endblock %}
    {% block sideBar %}{% endblock %}
    {% block sectionOne %}{% endblock %} {# Change these names as needed #}
    {% block sectionTwo %}{% endblock %}
    {% block sectionThree %}{% endblock %}


{% endblock %}

{% block footer %}{% endblock %}

{% block javascript %}{% endblock %}

</body> {% endblock %}
</html>`;
                    fs.writeFileSync(`${projName}/view/base.html.twig`, baseTwig);

                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                completed(" - All done!");

            });
        });
    });
});

// pkg Source/perfect_MVC_creator.js --targets node18-win-x64 --output Perfect_MVC_Creator.exe