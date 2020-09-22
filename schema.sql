DROP TABLE IF EXISTS covid;
CREATE TABLE IF NOT EXISTS  covid(
    id SERIAL PRIMARY KEY,
    country VARCHAR (255),
    code VARCHAR (255),
    confirmed_cases VARCHAR (300),
    deaths VARCHAR (255),
    total_recovered VARCHAR (255),
    date VARCHAR (255)

);