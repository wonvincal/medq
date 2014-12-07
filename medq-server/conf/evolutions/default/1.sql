# Create the medq database and user in H2, using H2 syntax.
#
# TODO: If decided to use rational DB in Google Cloud Platform (ie. MySQL),
#       probably better to set H2 to MYSQL mode and change this file to 
#       use MySQL syntax.
# TODO: Revisit all CHAR type columns for more realistic lengths. 
# TODO: Use encrypted password
 
# --- !Ups

CREATE USER medq PASSWORD 'slboqq' ADMIN;
CREATE SCHEMA medq AUTHORIZATION medq;

-- User is anyone with a login to the system
-- A User who has an Account is somebody like a clinic owner whom we send bill to
-- A User who has no Account is somebody like a patient or a nurse who has access 
CREATE TABLE medq.user(
id IDENTITY,
login char(30) NOT NULL UNIQUE
);

-- Example of an Account is a clinic
CREATE TABLE medq.account(
id IDENTITY,
user_fk BIGINT NOT NULL,
address CHAR(1000) NOT NULL,
FOREIGN KEY (user_fk) REFERENCES medq.user(id)
);
 
CREATE TABLE medq.professional(
id IDENTITY,
professional_id CHAR(30) NOT NULL,
account_fk BIGINT NOT NULL,
first_name CHAR(30) NOT NULL, 
last_name CHAR(30) NOT NULL, 
phone CHAR(30) NOT NULL, 
email CHAR(80) NOT NULL, 
FOREIGN KEY (account_fk) REFERENCES medq.account(id)
);
CREATE UNIQUE INDEX idx_professional_account_fk_prof_id ON medq.professional(account_fk, professional_id);

CREATE TABLE medq.customer(
id IDENTITY,
account_fk BIGINT,
account_customer_id char(30) NOT NULL, --Either the clinic already has an ID for each customer, or we copy the "id" to this column
first_name char(30) NOT NULL,
last_name char(30) NOT NULL,
phone char(30),
email char(80),
FOREIGN KEY (account_fk) REFERENCES medq.account(id)
);
CREATE UNIQUE INDEX idx_customer_account_fk_account_customer_id ON medq.customer(account_fk, account_customer_id);

CREATE TABLE medq.schedule(
id IDENTITY,
account_fk BIGINT NOT NULL,
name char(30),
time_in_min_per_slot SMALLINT,
appointment_per_slot TINYINT,
FOREIGN KEY (account_fk) REFERENCES medq.account(id)
);

CREATE TABLE medq.appointment(
id IDENTITY,
customer_fk BIGINT NOT NULL,
schedule_fk BIGINT NOT NULL,
note char(3000),
FOREIGN KEY (customer_fk) REFERENCES medq.customer(id),
FOREIGN KEY (schedule_fk) REFERENCES medq.schedule(id)
);

CREATE TABLE medq.contact_type(
id IDENTITY,
name char(30) NOT NULL UNIQUE,
description char(200)
);

CREATE TABLE medq.user_contact(
user_fk BIGINT NOT NULL,
contact_type_fk BIGINT NOT NULL,
contact_value char(30) NOT NULL,
FOREIGN KEY (user_fk) REFERENCES medq.user(id),
FOREIGN KEY (contact_type_fk) REFERENCES medq.contact_type(id)
);

CREATE TABLE medq.appointment_watcher(
appointment_fk BIGINT NOT NULL,
contact_type_fk BIGINT NOT NULL,
contact_value char(30) NOT NULL,
FOREIGN KEY (appointment_fk) REFERENCES medq.appointment(id),
FOREIGN KEY (contact_type_fk) REFERENCES medq.contact_type(id)
);

CREATE TABLE medq.queue(
id IDENTITY,
account_fk BIGINT NOT NULL,
name char(20) NOT NULL,
next_queue_fk BIGINT,  -- null when no next queue
FOREIGN KEY (account_fk) REFERENCES medq.account(id),
FOREIGN KEY (next_queue_fk) REFERENCES (id)
);

CREATE TABLE medq.queue_permission(
user_fk BIGINT NOT NULL,
queue_fk BIGINT NOT NULL,
permission TINYINT NOT NULL,
FOREIGN KEY (user_fk) REFERENCES medq.user(id),
FOREIGN KEY (queue_fk) REFERENCES medq.queue(id)
);
CREATE UNIQUE INDEX idx_queue_permission_user_fk_queue_fk_permission on medq.queue_permission(user_fk, queue_fk, permission);

CREATE TABLE medq.ticket(
id IDENTITY,
queue_fk BIGINT NOT NULL,
appointment_fk BIGINT,   -- null for customers with no appointment
state TINYINT NOT NULL,
FOREIGN KEY (queue_fk) REFERENCES medq.queue(id),
FOREIGN KEY (appointment_fk) REFERENCES medq.appointment(id)
);

CREATE TABLE medq.algo(
id IDENTITY,
name char(30) NOT NULL UNIQUE,
description char(500)
);

CREATE TABLE medq.algo_field(
id IDENTITY,
algo_fk BIGINT NOT NULL,
name char(30) NOT NULL,
description char(500),
field_type TINYINT NOT NULL,
is_mandatory BOOLEAN NOT NULL,
FOREIGN KEY (algo_fk) REFERENCES medq.algo(id)
);
CREATE UNIQUE INDEX idx_algo_field_algo_fk_name on medq.algo_field(algo_fk, name);

CREATE TABLE medq.queue_algo_field(
queue_fk BIGINT NOT NULL,
algo_field_fk BIGINT NOT NULL,
algo_field_value BIGINT,
FOREIGN KEY (queue_fk) REFERENCES medq.queue(id),
FOREIGN KEY (algo_field_fk) REFERENCES medq.algo_field(id)
);

# --- !Downs

DROP SCHEMA IF EXISTS medq;
DROP USER IF EXISTS medq;