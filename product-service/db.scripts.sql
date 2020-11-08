create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text,
	description text,
	price integer
)

create table if not exists stocks (
	product_id uuid references products (id),
	count integer
)

insert into products(title, description, price)
values
('Product One', 'Short Product Description1', 2.4),
('Product Two', 'Short Product Description3', 10),
('Product Three', 'Short Product Description2', 23),
('Product Four', 'Short Product Description7', 15),
('Product Five', 'Short Product Description2', 23),
('Product Six', 'Short Product Description4', 15),
('Product Seven', 'Short Product Description1', 23),
('Product Eight', 'Short Product Description7', 15)

select * from products

insert into stocks(product_id, count)
values
('3fd74766-745c-4dc3-a0cd-b0905305bb1c', 4),
('d5302b64-a45d-41c8-9e55-7943c061952a', 6),
('af639e73-2ae5-496a-8d35-7ac376488b85', 7),
('41886032-8420-45c2-bf80-bec440359262', 12),
('ae5f3c7d-efe6-4074-8607-a2d8f86e791f', 7),
('334b7a2a-64f5-4641-aca3-8e818e329726', 8),
('5c1bb9e3-15fd-4200-ab1e-d72ef56e1cf5', 2),
('6312b6b8-77a1-4ad1-aa6e-9a23b4259a8e', 3)

select * from stocks
