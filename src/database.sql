
CREATE TABLE todoList (
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    creation_date DATE NOT NULL, 
    due_date DATE
)