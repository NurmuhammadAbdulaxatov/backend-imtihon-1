const http = require("http");
const uuid = require("uuid");
const { read_file, write_file } = require("./fs_api/fs_api");

let app = http.createServer((req, res) => {
  const todo_id = req.url.split("/")[2];
  if (req.method === "GET") {
    if (req.url === "/get/all") {
      let todo = read_file("todo.json");
      return res.end(JSON.stringify(todo));
    }

    if (req.url === `/get/${todo_id}`) { 
      let todo = read_file("todo.json");
      let oneTodo = todo.find((t) => t.id === +todo_id);

      if (!oneTodo) return res.end("Todo not found!");

      return res.end(JSON.stringify(oneTodo));
    }
  }
  if (req.method === "POST") {
    if (req.url === "/create") {
      req.on("data", (chunk) => {
        let todo = read_file("todo.json");
        let new_todo = JSON.parse(chunk);
        let keys = Object.keys(new_todo);
        let title = false;
        let text = false;

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        const fullYear = `${day}.${month}.${year}`;

        for (let i = 0; i < keys.length; i++) {
          if (keys[i] == "title") {
            title = true;
          } else if (keys[i] == "text") {
            text = true;
          }
        }

        if (title == true) {
          if (new_todo?.title == "") {
            return res.end(JSON.stringify({ msg: "Title bosh bolmasn" }));
          }
        } else {
          return res.end(JSON.stringify({ msg: "Title key jonatlsn" }));
        }
        if (text == true) {
          if (new_todo?.text == "") {
            return res.end(JSON.stringify({ msg: "Text bosh bolmasn" }));
          }
        } else {
          return res.end(JSON.stringify({ msg: "Text key jonatlsn" }));
        }

        todo.push({
          id: todo.length + 1,
          isCompleted: false,
          createdDate: fullYear,
          ...new_todo,
        });
        write_file("todo.json", todo);
        return res.end(JSON.stringify({ msg: "Created" }));
      });
    }
  }

  if (req.method === "DELETE") {
    if (req.url === `/delete/${todo_id}`) {
      let todo = read_file("todo.json");
      let getOne = todo.find((c) => c.id === todo_id);
      if (!getOne) return res.end(JSON.stringify({ msg: "Todo not found" }));
      todo.forEach((t, idx) => {
        if (t.id === todo_id) {
          todo.splice(idx, 1);
        }
      });
      write_file("todo.json", todo);
      return res.end(JSON.stringify({ msg: "Deleted Todo!" }));
    }
  }

  if (req.method === "PUT") {
    if (req.url === `/update/${todo_id}`) {
      req.on("data", (chunk) => {
        let updateTodo = JSON.parse(chunk);

        let todo = read_file("todo.json");

        let getOne = todo.find((t) => t.id === +todo_id);

        if (!getOne) return res.end("Todo not found!");

        todo.forEach((t, idx) => {
          if (t.id === +todo_id) {
            t.title = updateTodo?.title;
            t.text = updateTodo?.text;
          }
        });
        console.log(update);

        write_file("todo.json", todo);

        return res.end("Updated todo!");
      });
    }

    if (req.url === `/updateDo/${todo_id}`) {
      req.on("data", (chunk) => {
        let updateTodo = JSON.parse(chunk);
        let todo = read_file("todo.json");
        let getOne = todo.find((t) => t.id === +todo_id);
        if (!getOne) return res.end("Todo not found!");
        todo.forEach((t, idx) => {
          if (t.id === +todo_id) {
            t.isCompleted = updateTodo.isCompleted;
          }
        });
        write_file("todo.json", todo);
        return res.end("Updated todo!");
      });
    }
  }
});

app.listen(4000, () => {
  console.log(`Server is running on the 4000 port`);
});
