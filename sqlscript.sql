create database Orgdata
use Orgdata

CREATE TABLE Members (
    id VARCHAR(15) NOT NULL,
    BPS INT,
    memberName VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    Branch VARCHAR(250),
    parentId VARCHAR(15),
    childrenIds JSON,
    imageLink VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (parentId) REFERENCES Members(id)
);

select * from members

