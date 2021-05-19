create table miningQueue(
    invoiceId varchar(50), 
    encryptedData mediumtext,
    status char(1) default 'n',
    confirmations int default 0
);

create table blockchain(sno INT auto_increment, IPFSHash varchar(64));
INSERT INTO blockchain(IPFSHash) VALUES(NULL);

alter table invoices modify invoiceId varchar(64);

SELECT * FROM (
    SELECT *
    FROM miningQueue
    WHERE status = 'n' 
    AND confirmations < 3
    LIMIT 1
) invoice,
(
    SELECT IPFSHash
    FROM blockchain
    LIMIT 1
) blk;

