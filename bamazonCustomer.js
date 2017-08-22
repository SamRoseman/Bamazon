//VARIABLES =========================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon"
});
var idArray = [];
//FUNCTIONS ========================================================
function showStore () {
    var query = connection.query(
    "SELECT * FROM products",
    function(error,results) {
        if (error) throw error;
        else {
            var store = new Table;
            results.forEach(function(data) {
                store.cell("ID", data.id)
                store.cell("Product", data.product)
                store.cell("Price", data.price, Table.number(2))
                store.newRow()
            });
            console.log(store.toString());
        }
    });
};

function userPurchase () {
var query = connection.query(
    "SELECT * FROM products",
    function(err,results) {
        if (err) throw err;
        else {
            for (var i = 0; i < results.length; i++) {
                idArray.push(JSON.stringify(results[i].id));
            }
        }
    inquirer.prompt([
        {
            type: "list",
            message: "Select the item you'd like to purchase.",
            choices: idArray,
            name: "userchoice"
        },
        {
            message: "How many would you like to purchase?",
            name: "useramount",
            validate: function(value) {
				if (isNaN(value) === false){
					return true;
				}
				else {
					return false;
				}
			}
        }
    ]).then(function(data) {
        var query = connection.query(
            "SELECT * FROM products WHERE ?",
            {
                id: data.userchoice

            },function(err, result) {
                var sales = parseFloat(result[0].sales);
                var price = parseFloat(result[0].price);
                var quantity = parseInt(result[0].quantity);
                if (quantity < data.useramount){
                    console.log("Insufficient quantity. Purchase Unsucessful");
                    inquirer.prompt([
                        {
                            type: "confirm",
                            default: true,
                            message: "Would you like to continue shopping?",
                            name: "confirm"
                        }
                    ]).then(function(data){
                        if (data.confirm)
                            userPurchase();
                        else {
                            connection.end();
                        }
                    })
                }
                else {
                    quantity = quantity - data.useramount;
                    var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                        [{
                            quantity: quantity
                        },
                        {
                            id: data.userchoice
                        }],
                    function(err, result){
                        var total = price * data.useramount;
                        var updatedSales = sales + total;
                        var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                            sales: updatedSales
                        },
                        {
                            id: data.userchoice
                        }]
                        )
                        console.log("Your purchase was successful. Your total is $" + total);
                        inquirer.prompt([
                            {
                                type: "confirm",
                                default: true,
                                message: "Would you like to continue shopping?",
                                name: "confirm"
                            }
                        ]).then(function(data){
                            if (data.confirm)
                                userPurchase();
                            else {
                                connection.end();
                            }
                        })
                    });
                }
            })

    });

    });

};

//MAIN PROCESS ===================================================

connection.connect(function(err) {
    if (err) throw err;
});

showStore();

userPurchase();
