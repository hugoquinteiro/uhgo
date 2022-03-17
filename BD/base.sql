--DROP TABLE produto 
CREATE TABLE produto (
codprod INTEGER NOT NULL,
descrprod CHARACTER VARYING(150),
marca CHARACTER VARYING(30),
referencia CHARACTER VARYING(30),
codbarra CHARACTER VARYING(13),
vlrvenda DECIMAL(12,2),
CONSTRAINT pk_produto PRIMARY KEY (codprod));
ALTER TABLE produto   ADD COLUMN ESTOQUE INTEGER;

/*
ALTER TABLE produto   ADD COLUMN COLOR CHARACTER VARYING (10);
UPDATE PRODUTO SET COLOR='dark' WHERE MARCA='MQ PRO'; 
UPDATE PRODUTO SET COLOR='primary' WHERE MARCA='MQ BEAUTY'; 
UPDATE PRODUTO SET COLOR='info' WHERE MARCA='PARLUX';
UPDATE PRODUTO SET COLOR='danger' WHERE MARCA='FORCE BARB';
UPDATE PRODUTO SET COLOR='warning' WHERE MARCA='MQ ESCOVAS';
*/


--DROP TABLE marca
CREATE TABLE marca (
marca 			CHARACTER VARYING (15),
marcapublico	CHARACTER VARYING (30),
color		 	CHARACTER VARYING (30),
textcolor 		CHARACTER VARYING (30),
ordem			INTEGER,
CONSTRAINT PK_MARCA PRIMARY KEY (marca)
);

--DELETE FROM MARCA
INSERT INTO marca (MARCA, MARCAPUBLICO, COLOR, textcolor, ORDEM) VALUES ('MQ PRO','MQ PROFESSIONAL','dark','light', 1); 
INSERT INTO marca (MARCA, MARCAPUBLICO, COLOR, textcolor, ORDEM) VALUES ('MQ BEAUTY','MQ BEAUTY','light','dark',2); 
INSERT INTO marca (MARCA, MARCAPUBLICO, COLOR, textcolor, ORDEM) VALUES ('PARLUX','PARLUX','info','light',3); 
INSERT INTO marca (MARCA, MARCAPUBLICO, COLOR, textcolor, ORDEM) VALUES ('FORCE BARB','FORCE BARBER','danger','light',4); 
INSERT INTO marca (MARCA, MARCAPUBLICO, COLOR, textcolor, ORDEM) VALUES ('MQ ESCOVAS','MQ ESCOVAS','warning','dark',5); 

--DROP TABLE pedido
CREATE TABLE pedido (
  id SERIAL,
  usuario CHARACTER VARYING(30),
  dtcria TIMESTAMP,
  total DECIMAL(12,2),
  vlrdesc DECIMAL(12,2),
  CONSTRAINT pk_pedido PRIMARY KEY (id)
);
--INSERT INTO pedido (usuario, dtcria, total) VALUES ('Outros', CURRENT_TIMESTAMP, 100.99);


--DROP TABLE itpedido
CREATE TABLE itpedido (
  id INTEGER NOT NULL,
  codprod INTEGER NOT NULL,
  quantidade INTEGER,
  vlrvenda DECIMAL,
  codbarra CHARACTER VARYING(13),
  CONSTRAINT fk_itpedido_pedido FOREIGN KEY (id)
	  REFERENCES pedido (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION 
);
-- INSERT INTO itpedido VALUES (1, 147, 2, 50.5);


/*  SQL de busca no Sankhya
SELECT 
    exc.CODPROD
    ,pro.DESCRPROD
    ,bar.CODBARRA
    ,pro.REFERENCIA
    ,REPLACE(TO_CHAR(COALESCE(ROUND(exc.VLRVENDA,2),50.01)),',','.') as vlrvenda --temporario trocando nulo por 50.01
    ,pro.MARCA
FROM tgfexc exc
INNER JOIN tgfpro pro ON (exc.codprod = pro.codprod)
LEFT JOIN tgfbar bar ON (pro.codprod  = bar.codprod)
WHERE pro.marca NOT IN ('MQ TESOURA')
AND exc.nutab=440
*/