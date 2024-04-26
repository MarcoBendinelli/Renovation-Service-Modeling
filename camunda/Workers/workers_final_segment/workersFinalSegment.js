import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

var index = 0;

/*// susbscribe to the topic: 'GenericTopic'
client.subscribe("GenericTopic", async function({ task, taskService }) {
  // Put your business logic
  const var1 = task.variables.get("var1");
  const newVarValue = "This is the value";
  const processVariables = new Variables();
  processVariables.set("newVarName", newVarValue);
  processVariables.set("var1", "Marco");
  // complete the task
  await taskService.complete(task, processVariables);
});*/

client.subscribe("contact_winner_constructor", async function({ task, taskService }) {
  // Put your business logic
  var best_quote_constructor = task.variables.get(best_constructors_quotation);
  fetch("http://localhost:8081/v1/confirmations", {
  method: "POST",
  body: JSON.stringify({
    quoteId : best_quote_constructor.quoteId,
    message : "Confirmed"
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
.then((response) => response.json())
.then((json) => console.log(json));
  // complete the task
  await taskService.complete(task);
});

client.subscribe("contact_winner_electrician", async function({ task, taskService }) {
  // Put your business logic
  var best_quote_electrician = task.variables.get(best_electricians_quotation);
  fetch("http://localhost:8082/v1/contracts", {
  method: "POST",
  body: JSON.stringify({
    workId : best_quote_electrician.workId,
    text : "ultra cool description of the contract"
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
.then((response) => response.json())
.then((json) => console.log(json));
  // complete the task
  await taskService.complete(task);

  fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName : "electrician_work_done",
        processVariables : {
            electricianworkdone : {value : true, type: "Boolean"}
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
});

client.subscribe("contact_winner_plumber", async function({ task, taskService }) {
  // Put your business logic
  let best_quote_plumber = task.variables.get(best_plumbers_quotation);
  fetch("http://localhost:8084/v1/agreements", {
  method: "POST",
  body: JSON.stringify({
    quoteId: best_quote_plumber.quoteId,
    message: "Selected"
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
.then((response) => response.json())
.then((json) => console.log(json));
  // complete the task
  await taskService.complete(task);


});

client.subscribe("ask_status", async function({ task, taskService }) {
  // Put your business logic
  async function assign_workdone_plumber(item) {
    await taskService.complete(task);
    let status = true;
    if(item == "Working"){
      status = false
    }
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName : "plumber_work_done",
        processVariables : {
          plumberworkdone : {value : status, type: "Boolean"}
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };
  let best_quote_plumber = task.variables.get(best_plumbers_quotation);
  fetch("http://localhost:8084/v1/status/" + best_quote_plumber.quoteId, {
  method: "GET",
})
.then((response) => response.json())
.then((json) => (assign_workdone_plumber(json)));

});

client.subscribe("inform_householder", async function({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("get_money", async function({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("archive_order", async function({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("retrieve_contact_constructor", async function({ task, taskService }) {
  // Put your business logic
  const processVariables = new Variables();
  processVariables.set("phone_constructor", "3238573813");
  // complete the task
  await taskService.complete(task, processVariables);
});

client.subscribe("retrieve_contact_electrician", async function({ task, taskService }) {
  // Put your business logic
  const processVariables = new Variables();
  processVariables.set("phone_electrician", "3238573813");
  // complete the task
  await taskService.complete(task, processVariables);
});