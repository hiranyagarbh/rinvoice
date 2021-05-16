create table miningQueue(
    invoiceId varchar(50), 
    encryptedData mediumtext,
    status char(1) default 'n'
);