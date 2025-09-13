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
                } catch (error) {
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

                try {
                    const tempTwig = `{% extends 'base.html.twig' %}`;
                    fs.writeFileSync(`${projName}/view/template.html.twig`, tempTwig);

                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const homeTwig = `{% extends 'template.html.twig' %}   
{% block hero %}If you can see this, all is good{% endblock %}
        `;
                    fs.writeFileSync(`${projName}/view/public/public.index.html.twig`, homeTwig);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const cfgFile = `<?php
const DB_DRIVER = "mysql";
const DB_HOST = "localhost";
const DB_LOGIN = "root";
const DB_PWD = "";
const DB_NAME = "${dbName}";
const DB_PORT = ${dbPort};
const DB_CHARSET = "utf8mb4";
const PROJECT_DIRECTORY = __DIR__;
const PUB_DIR = '/public/';
const IMG_DIR = '/public/images';
`;

                    fs.writeFileSync(`${projName}/config.php`, cfgFile);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

try {
                const index = `<?php
session_start();
if (isset($_SESSION["activity"]) && time() - $_SESSION["activity"] > 1800) {
    session_unset();
    session_destroy();
    header("location: ./");
    exit();
}
$_SESSION["activity"] = time();
if (isset($_SESSION["systemMessage"])) {
    $systemMessage = $_SESSION["systemMessage"];
    unset($_SESSION["systemMessage"]);
}else {
    $systemMessage = "";
}
$sessionRole = "";
if(isset($_SESSION['roles'])) $sessionRole = $_SESSION['roles'];
use Twig\\Loader\\FilesystemLoader;
use Twig\\Environment;
use factory\\ConnectionFactory;
require_once "../config.php";
spl_autoload_register(function ($class) {
  $class = str_replace('\\\\', '/', $class);
  require PROJECT_DIRECTORY.'/' .$class . '.php';
});
require_once PROJECT_DIRECTORY.'/vendor/autoload.php';
$loader = new FilesystemLoader(PROJECT_DIRECTORY.'/view/');
// Dev version
$twig = new Environment($loader, [
  'debug' => true,
]);
$twig->addExtension(new \\Twig\\Extension\\DebugExtension());

$twig->addGlobal('PUB_DIR', PUB_DIR);
$twig->addGlobal('PROJ_DIR', PROJECT_DIRECTORY);
$twig->addGlobal("ENV", ENV_MODE);
// // Prod version
// $twig = new Environment($loader, [
//    'cache' => '../cache/Twig',
//    'debug' => false,
// ]);
// // no DebugExtension online
 var_dump($_SESSION);
try {
    $db = ConnectionFactory::createDb();
} catch (Exception $e) {
    die($e->getMessage());
}

require_once PROJECT_DIRECTORY . '/Controllers/RouteController.php';
$db = null;`
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}

try {
    const pdo = `<?php
namespace model;
use PDO;
use Exception;
class MyPDO extends PDO
{
    private static array $instances = [];

    private function __construct($dsn, $username = null, $password = null, $options = null)
    {
        parent::__construct($dsn, $username, $password, $options);
    }

    public static function getInstance($dsn, $username = null, $password = null, $options = null): MyPDO
    {
        $key = md5($dsn . $username);
        if (!isset(self::$instances[$key])) {
            try {
                self::$instances[$key] = new MyPDO($dsn, $username, $password, $options);
            } catch (Exception $e) {
                die("Connection Error : " . $e->getMessage());
            }
        }
        return self::$instances[$key];
    }
}
`
    fs.writeFileSync(`${projName}/model/MyPDO.php`, pdo);
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}

try {
                    const absController = `<?php

namespace Controllers\\Abstract;

use Factory\\ManagerFactory;
use Twig\\Environment;
use model\\Trait\\TraitLaundryRoom, model\\Trait\\TraitStringTest, model\\Trait\\TraitIntTest;

abstract class AbstractController
{
    use TraitLaundryRoom, TraitStringTest, TraitIntTest;

    protected Environment $twig;
    protected ManagerFactory $managerFactory;
    protected string $csrfToken;

    public function __construct(Environment $twig, ManagerFactory $managerFactory)
    {
        $this->twig = $twig;
        $this->managerFactory = $managerFactory;
        $this->csrfToken = $this->createNewCsrfToken();
    }

    protected function getManager(string $class): object
    {
        return $this->managerFactory->get($class);
    }

    protected function parsePostData(array $postData): array
        /*
         * Receives an array containing all $_POST data sent by the form
         * Each entry is made up of key:value
         * The key shows what type of input was expected (int, string, etc)
         * These are then separated and returned as, for example :
         * "user_email" = ["type" => "email","value" => "lee@leerlandais.com"]
         */
    {
        $result = [];
        foreach ($postData as $key => $value) {
            if ($key === 'csrf:csrf_token' || $key === 'csrf_token') {
                continue;
            }
            if (str_contains($key, ':')) {
                list($type, $name) = explode(':', $key, 2);
            } else {
                $type = 'str';
                $name = $key;
            }
            if ($type !== "unset") {
                $result[$name] = ["type" => $type, "value" => $value];
            }
        }
        return $result;
    }

    protected function testAndClean(array $cleanThis): string|int|null
    {
        /*
         * Receives an array of data, normally generated by the parsePostData function
         * Switches through the 'type' of data received (email, string, int, etc)
         * Tests if data conforms to expected type (int or string)
         * Performs necessary sanitisation for data using my usual TraitLaundryRoom
         * Returns the sanitised data
         */
        if (empty($cleanThis)) return null;
        switch ($cleanThis["type"]) {
            case "int":
                return $this->intClean($cleanThis["value"]);
            case "str":
            case "phone":
                if ($this->findTheNeedles($cleanThis["value"])) {
                    $_SESSION["systemMessage"] = "Possible Injection Detecté";
                    header("Location: ./");
                    exit();
                }
                return $this->standardClean($cleanThis["value"]);
            case "json":
                if ($this->findTheNeedles($cleanThis["value"])) {
                    $_SESSION["systemMessage"] = "Possible Injection Detecté";
                    header("Location: ./");
                    exit();
                }
                return $this->simpleTrim($cleanThis["value"]);
            case "email":
                if ($this->findTheNeedles($cleanThis["value"])) {
                    $_SESSION["systemMessage"] = "Possible Injection Detecté";
                    header("Location: ./");
                    exit();
                }
                return $this->emailClean($cleanThis["value"]);
            case "pass":
                return $this->simpleTrim($cleanThis["value"]);
            case "date":
                return $this->dateClean($cleanThis["value"]);
        }

        return $cleanThis["value"];
    }

    protected function checkPermissions(string $level, string $role): void
    {
        if (!$this->verifyUserLevel($level, $role)) {
            $_SESSION["systemMessage"] = "Vous n'êtes pas autorisé à accéder à cette page.";
            header("Location: ./");
            exit();
        }
    }

    /**
     * Verifies whether the user's access level matches the required level.
     * Checks if user level JSON contains the necessary level
     *
     * @param string $level The required access level to verify.
     * @param string $userLevel The user's access levels (JSON).
     *
     * @return bool Returns true if user level is accepted or false if not
     */
    private function verifyUserLevel(string $level, string $userLevel): bool
    {
        if (!$userLevel) return false;
        if (!in_array($level, json_decode($userLevel))) return false;
        return true;
    }

    protected function verifyCsrfToken(?string $token): void
    {
        /*
         * Used on all forms.
         * Compares input csrfToken to session
         * If token is incorrect, user is returned to menu
         * If token is correct, it is destroyed and replaced
         */
        if (!isset($token) || $token != $_SESSION['csrf_token']) {
            $_SESSION = [];
            $_SESSION["systemMessage"] = "CSRF Token incorrect";
            header("Location: ?route=home");
            die();
        }
        unset($_SESSION['csrf_token']);
        $this->createNewCsrfToken();
    }

    protected function preparePostData(array $postData): array
    {
        /*
         * Centralises the regularly used parsePostData and testAndClean combination
         * Makes them available for all Controllers : DRY is the way
         */
        $parsedData = $this->parsePostData($_POST);
        foreach ($parsedData as &$data) {
            $data = $this->testAndClean($data);
        }
        return $parsedData;
    }

    /**
     * @throws RandomException
     */
    private function createNewCsrfToken(): string
    {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
}
`

    fs.writeFileSync(`${projName}/Controllers/Abstract/AbstractController.php`, absController);
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}

try{
    const routeController = `<?php
namespace Controllers;
use    model\\Manager\\RouteManager;


$router = new RouteManager($twig, $db);

// Register routes
// GENERAL ROUTES
$router->registerRoute('home', ConnectionController::class, 'index');
$router->registerRoute("logout", ConnectionController::class, "logout");
$router->registerRoute('404', ErrorController::class, 'error404');




// Handle request
$route = $_GET['route'] ?? 'home';
$router->handleRequest($route);`

    fs.writeFileSync(`${projName}/Controllers/RouteController.php`, routeController);
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}



                completed(" - All done!");

            });
        });
    });
});

// pkg Source/perfect_MVC_creator.js --targets node18-win-x64 --output Perfect_MVC_Creator.exe