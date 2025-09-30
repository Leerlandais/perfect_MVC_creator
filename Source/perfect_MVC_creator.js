const readline = require('readline');
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const completed = (msg) => {
    console.error(msg);
    rl.question('The process seems to have completed successfully - press Enter to close', () => {
        rl.close();
    });
};

rl.question("Enter the project name : ", function (projName) {
    rl.question("Enter the database name (DB_NAME): ", function (dbName) {
        rl.question("MariaDb or Mysql : (default: 3306 (MySql)) ", function (dbPortal) {
            const dbPort = dbPortal || 3306;
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
                    console.error(`Error occurred: ${error.message}`);
                }

                function createReadmeInFolders(folders) {
                    folders.forEach(folder => {
                        try {
                            if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
                                const folderName = path.basename(folder);
                                const readmeContent = `# Placeholder for ${folderName}`;

                                fs.writeFileSync(path.join(folder, 'README.md'), readmeContent);
                                console.error(`Created README.md in ${folder}`);
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
                console.error(`Created README.md in all folders`);
                try {
                    const extIndex = `<?php
    header("Location: public");
    die();
            `;
                    fs.writeFileSync(`${projName}/index.php`, extIndex);
                    console.error(`Created index.php`);
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
                    console.error(`Created .gitignore`);
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
<body class="{% block bodyClass %}{% endblock %}">{% block body %}
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
                    console.error(`Created base.html.twig`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const tempTwig = `{% extends 'base.html.twig' %}
{% block stylesheet %}
    <\link href="../dist/tailwind.min.css" rel="stylesheet">
{% endblock %}
{% block bodyClass %}h-screen bg-amber-50{% endblock %}

{% block javascript %}
<script src="{{ PUB_DIR }}scripts/tableSorter.js"></script>
{% endblock %}`;
                    fs.writeFileSync(`${projName}/view/template.html.twig`, tempTwig);
                    console.error(`Created template.html.twig`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const homeTwig = `{% extends 'template.html.twig' %}   
{% block hero %}If you can see this, all is good{% endblock %}
        `;
                    fs.writeFileSync(`${projName}/view/public/public.index.html.twig`, homeTwig);
                    console.error(`Created public.index.html.twig`);
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
                    console.error(`Created config.php`);
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
                    fs.writeFileSync(`${projName}/public/index.php`, index);
                    console.error(`Created index.php`);
                } catch (error) {
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
                    console.error(`Created MyPDO.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const absController = `<?php

namespace Controllers\\Abstract;

use Factory\\ManagerFactory;
use Twig\\Environment;
use model\\Trait\\TraitLaundryRoom;

abstract class AbstractController
{
    use TraitLaundryRoom;

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
                    console.error(`Created AbstractController.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
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
                    console.error(`Created RouteController.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const connFactory = `<?php

namespace factory;

use model\\MyPDO;

class ConnectionFactory
{
    public static function createDb(): MyPDO
    {
        return MyPDO::getInstance(
            DB_CONNECTION_STRING,
            DB_LOGIN,
            DB_PWD,
            DB_OPTIONS
        );
    }

}`
                    fs.writeFileSync(`${projName}/factory/ConnectionFactory.php`, connFactory);
                    console.error(`Created ConnectionFactory.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const managerFactory = `<?php

namespace Factory;

use model\\MyPDO;


class ManagerFactory
{
    private MyPDO $db;
    private array $instances = [];

    public function __construct(MyPDO $db)
    {
        $this->db = $db;

    }

    public function get(string $managerClass): object
    {
        /*
         * Centralises Managers
         * Child Controllers call for their necessary Managers via their __construct
         * AbstractController requests the Manager from here and passes it on
         * This way only one function is used to instantiate Managers : DRY is the way
         */
        if (!isset($this->instances[$managerClass])) {
            $this->instances[$managerClass] = new $managerClass(
                $this->db
            );
        }
        return $this->instances[$managerClass];
    }
}`
                    fs.writeFileSync(`${projName}/factory/ManagerFactory.php`, managerFactory);
                    console.error(`Created ManagerFactory.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const absMan = `<?php

namespace model\\Abstract;

use model\\MyPDO;
use Twig\\Environment;

abstract class AbstractManager
{
    protected MyPDO $db;
    protected Environment $twig;

    public function __construct(MyPDO $db)
    {
        $this->db = $db;
    }
    protected function insertAnything(array $data, string $dbName, string $dbType = "db"): bool
    {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $stmt = $this->$dbType->prepare("INSERT INTO $dbName ($columns) VALUES ($placeholders)");
        $stmt->execute($data);
        return (int)$this->$dbType->lastInsertId() > 0; // Turns out insert and a rowCount() check is not always valid. Better to use a lastInsertId check
    }
    protected function updateAnything(array $data, string $uniqueField, int $responseId, string $dbName, string $dbType = "db"): bool
    {
        $dataSet = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($data)));
        $stmt = $this->$dbType->prepare("UPDATE $dbName SET $dataSet WHERE \`$uniqueField\` = :id");
        $stmt->execute(array_merge($data, ["id" => $responseId]));
        return $stmt->rowCount() > 0; // rather than if($stmt->rowCount() === 0) return false; return true; This does it in one line
    }
}`;
                    fs.writeFileSync(`${projName}/model/Abstract/AbstractManager.php`, absMan);
                    console.error(`Created AbstractManager.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const absMapping = `<?php
namespace model\\Abstract;
abstract class AbstractMapping
{
    public function __construct(array $tab)
    {
        $this->hydrate($tab);
    }
    protected function hydrate(array $assoc): void
    {
        foreach ($assoc as $key => $value) {
            $tab = explode("_", $key);
            $majuscule = array_map('ucfirst',$tab);
            $newNameCamelCase = implode($majuscule);
            $methodeName = "set" . $newNameCamelCase;
            if (method_exists($this, $methodeName)) {
                $this->$methodeName($value);
            }
        }
    }
}`
                    fs.writeFileSync(`${projName}/model/Abstract/AbstractMapping.php`, absMapping);
                    console.error(`Created AbstractMapping.php`);
                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }


                try {
                    const connManager = `<?php

namespace model\\Manager;
use model\\Abstract\\AbstractManager;
class ConnectionManager extends AbstractManager
{
    public function logoutUser() : void
    {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }
    
}`
                    fs.writeFileSync(`${projName}/model/Manager/ConnectionManager.php`, connManager);
                    console.error(`Created ConnectionManager.php`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

try {
                    const routeManager = `<?php

namespace model\\Manager;

use Factory\\ManagerFactory;
use model\\MyPDO;
use Twig\\Environment;

class RouteManager
{
    private array $routes = [];
    private Environment $twig;

    private ManagerFactory $factory;

    public function __construct(Environment $twig, MyPDO $db)
    {
        $this->twig = $twig;

        $this->factory = new ManagerFactory($db);
    }

    public function registerRoute(string $routeName, string $controllerClass, string $methodName): void
    {
        $this->routes[$routeName] = [
            'controller' => $controllerClass,
            'method' => $methodName
        ];
    }

    public function handleRequest($route): void
    {
        if (!isset($this->routes[$route])) {
            $route = '404';
        }

        $controllerClass = $this->routes[$route]['controller'];
        $method = $this->routes[$route]['method'];

        $controller = new $controllerClass($this->twig, $this->factory);

                $params = $_GET ?? [];
        if (!empty($params)) {
            $controller->$method($params);
        } else {
            $controller->$method(null);
        }
    }
}`
    fs.writeFileSync(`${projName}/model/Manager/RouteManager.php`, routeManager);
                    console.error(`Created RouteManager.php`);
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}

try {
                    const config = `<?php

const DB_DRIVER = "mysql",
DB_HOST = "localhost",
DB_LOGIN = "root",
DB_PWD = "",
DB_NAME = "isp_main",
DB_PORT = 3306,
DB_CHARSET = "utf8mb4",
DB_OPTIONS = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];
const DB_CONNECTION_STRING = DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;

const PROJECT_DIRECTORY = __DIR__,
PUB_DIR = '../public/';

const ENV_MODE = "DEV";`
    fs.writeFileSync(`${projName}/config.php`, config);
                    console.error(`Created config.php`);
}catch (error) {
                    console.error(`Error occurred: ${error.message}`);
}
                try {
                    const trait = `<?php
namespace model\\Trait;

use DateTime;
use Exception;

Trait TraitLaundryRoom {
   protected function standardClean($cleanThis): string
    {
        return htmlspecialchars(strip_tags(trim($cleanThis)), ENT_QUOTES);
    }
   protected function simpleTrim($trimThis): string
    {
        return trim($trimThis);
    }
   protected function urlClean($cleanThisUrl): string
    {
        return filter_var($cleanThisUrl, FILTER_SANITIZE_URL);
    }
   protected function intClean($cleanThisInt): int
    {
        $cleanedInt = filter_var($cleanThisInt, FILTER_SANITIZE_NUMBER_INT,
            FILTER_FLAG_ALLOW_FRACTION
        );
        $cleanedInt = intval($cleanedInt);
        return $cleanedInt;
    }
   protected function floatClean($cleanThisFloat): float
    {
        $cleanedFloat = filter_var($cleanThisFloat, FILTER_SANITIZE_NUMBER_FLOAT,
            FILTER_FLAG_ALLOW_FRACTION,
        );
        $cleanedFloat = floatval($cleanedFloat);
        return $cleanedFloat;
    }
   protected function emailClean($cleanThisEmail): string
    {
        return filter_var($cleanThisEmail, FILTER_SANITIZE_EMAIL);
    }
    protected function dateClean(string|DateTime $dateInput): string
    {
        try {
            if ($dateInput instanceof DateTime) {
                // if it's already DateTime, it can only have come from the server side, so ok
                $date = $dateInput;
            } else {
                // if it's a string, sanitise it and create a DateTime from it
                $cleaned = trim($dateInput);
                $cleaned = preg_replace('/[^0-9\\-:\\/\\sTZ]/', '', $cleaned);
                $date = new DateTime($cleaned);
            }

            return $date->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            // If all that fails, send back the current time
            return (new DateTime())->format('Y-m-d H:i:s');
        }
    }
   protected function findTheNeedles($hay): bool
    {
        $needles = ["<script>",
            "<iframe>",
            "<object>",
            "<embed>",
            "<form>",
            "<input>",
            "<textarea>",
            "<select>",
            "<button>",
            "<link>",
            "<meta>",
            "<style>",
            "<svg>",
            "<base>",
            "<applet>",
            "script",
            "'click'",
            '"click"',
            "onclick",
            "onload",
            'onerror',
            'src'];
        foreach ($needles as $needle) {
            if (str_contains($hay, $needle)) {
                return true;
            }
        }
        return false;
    }
}`
                    fs.writeFileSync(`${projName}/model/Trait/TraitLaundryRoom.php`, trait);
                    console.error(`Created TraitLaundryRoom.php`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try{
const connCont = `<?php

namespace Controllers;


use Factory\\ManagerFactory;
use model\\Manager\\ConnectionManager;
use Twig\\Environment;


class ConnectionController extends Abstract\\AbstractController
{
    private ConnectionManager $connectionManager;

    public function __construct(Environment $twig, ManagerFactory $managerFactory)
    {
        /*
         * Instantiates Managers needed for this Controller
         * Avoids instantiation of unneeded Managers
         */
        parent::__construct($twig, $managerFactory);
        $this->connectionManager = $this->getManager(ConnectionManager::class);
    }
    public function logout()
    {
        $this->connectionManager->logoutUser();
        header("Location: ./");
        exit;
    }

    public function index() : void
    {
        echo $this->twig->render('public/public.index.html.twig');
    }
}`
                    fs.writeFileSync(`${projName}/Controllers/ConnectionController.php`, connCont);
console.error(`Created ConnectionController.php`);
                }catch(error){
                    console.error(`Error occurred: ${error.message}`);
                }
                try {
                    const tableSorter = `const currentOrder = new WeakMap();

function sortTable(table, columnIndex) {

    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll("tr"));
    let state = currentOrder.get(table) || { column: null, order: 'asc' };

    if (state.column === columnIndex) {
        state.order = state.order === 'asc' ? 'desc' : 'asc';
    } else {
        state.order = 'asc';
    }
    state.column = columnIndex;
    
    currentOrder.set(table, state);

    const sortedRows = rows.sort((a, b) => {
        const A = a.children[columnIndex].textContent.trim();
        const B = b.children[columnIndex].textContent.trim();
        if (state.order === 'asc') {
            return A.localeCompare(B, undefined, { numeric: true });
        } else {
            return B.localeCompare(A, undefined, { numeric: true });
        }
    });

    tbody.innerHTML = "";
    sortedRows.forEach(row => tbody.appendChild(row));
}
document.querySelectorAll("table").forEach(table => {
    table.querySelectorAll("th").forEach((th, index) => {
        th.addEventListener("click", () => sortTable(table, index));
    });
});`
                    fs.writeFileSync(`${projName}/public/scripts/tableSorter.js`, tableSorter);
                    console.error(`Created tableSorter.js`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {

                    const tailConf = `/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./view/**/*.twig', './public/scripts/*.js'],
    theme: {
        extend: {},
    },
    plugins: [],
}`;
                    fs.writeFileSync(`${projName}/tailwind.config.js`, tailConf);
                    console.error(`Created tailwind.config.js`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }
                try {
                    const postCss = `module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    }
};`;
                    fs.writeFileSync(`${projName}/postcss.config.js`, postCss);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }
                try {
                    const TailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
/* Personalised TW Classes go here */`
                    fs.writeFileSync(`${projName}/public/styles/tailwind.css`, TailwindCss);
                    console.error(`Created tailwind.css`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }
                try {

                    const packJson = `{
  "dependencies": {
    "@fullhuman/postcss-purgecss": "^7.0.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  },
  "scripts": {
    "build:css": "npx tailwindcss -i ./public/styles/tailwind.css -o ./dist/tailwind.min.css --minify"
  }
}`;
                    fs.writeFileSync(`${projName}/package.json`, packJson);
                    console.error(`Created package.json`);
                }catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                    process.chdir(`${projName}`);
                execSync('npm install tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20 @fullhuman/postcss-purgecss');
                    let composerAvailable = false;
                    try {
                        execSync('composer --version', { stdio: 'ignore' });
                        composerAvailable = true;
                    } catch {
                        console.error('Composer not found. Skipping Twig installation.');
                    }



                    if (composerAvailable) {
                        execSync(`composer require "twig/twig:^3.0"`, { stdio: 'inherit' });
                        execSync(`npm run build:css`, { stdio: 'inherit' });
                        console.error(`Added Twig to composer.json`);
                    }
                    execSync(`git init`, {stdio: 'inherit'});
                    execSync(`git branch -m main`, {stdio: 'inherit'});
                    execSync(`git add .`, {stdio: 'inherit'});
                    execSync(`git commit -m "Setup completed by Leerlandais"`, {stdio: 'inherit'});
                    if (gitRep) {
                        execSync(`git remote add origin ${gitRep}`, {stdio: "inherit"});
                        execSync('git push -u origin main', {stdio: "inherit"});
                    }


                completed(" - All done!");

            });
        });
    });
});

// pkg Source/perfect_MVC_creator.js --targets node18-win-x64 --output Perfect_MVC_Creator.exe