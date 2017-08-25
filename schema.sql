CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id INT AUTO_INCREMENT NOT NULL,
    product VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    price DECIMAL(4,2) NOT NULL,
    quantity INT NOT NULL,
    sales DECIMAL(5,3),
    PRIMARY KEY(id)
);


CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(75) NOT NULL,
    overhead_costs DECIMAL(5,3) NOT NULL,
    PRIMARY KEY(id)
);
