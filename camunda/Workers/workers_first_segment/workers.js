import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

const company_name = "House Rennovation Company";

// Fake DB Plumber
let plumber = {
  name: "Plumber Family",
};
let plumber1 = {
  name: "Plumber Bros",
};
let plumber2 = {
  name: "Plumber Co",
}
let plumbers_list = [plumber, plumber1, plumber2];

// Fake DB Constructor
let constructor = {
  name: "Constructor Family",
};
let constructor1 = {
  name: "Constructor Bros",
};
let constructor2 = {
  name: "Constructor Co",
}
const constructors_list = [constructor, constructor1, constructor2];

// Fake DB Electrician
let electrician = {
  name: "Electrician Family",
};
let electrician1 = {
  name: "Electrician Bros",
};
let electrician2 = {
  name: "Electrician Co",
}
const electricians_list = [electrician, electrician1, electrician2];



client.subscribe("retrieve_request_content", async function ({ task, taskService }) {
  await taskService.complete(task);
});

client.subscribe("evaluate_area", async function ({ task, taskService }) {
  // Put your business logic
  let processVariables1 = new Variables();
  let region = task.variables.get("region");
  if (region == "Campania") {
    processVariables1.set("regionReview", false);
  } else {
    processVariables1.set("regionReview", true);
  }

  // complete the task
  await taskService.complete(task, processVariables1);
});

client.subscribe("evaluate_budget", async function ({ task, taskService }) {
  setTimeout(async function () {
    // Codice da eseguire dopo il ritardo
    let processVariables = new Variables();
    let budget = task.variables.get("budget");
    if (budget >= 150) {
      processVariables.set("budgetReview", true);
    } else {
      processVariables.set("budgetReview", false);
    }
    // complete the task
    await taskService.complete(task, processVariables);
  }, 2000);
});

client.subscribe("prepare_result_message", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let budgetReview = task.variables.get("budgetReview");
  let regionReview = task.variables.get("regionReview");
  if (budgetReview && regionReview) {
    // Preparing result OK
    processVariables.set("feasible", true);
  } else {
    // Preparing result KO
    processVariables.set("feasible", false);
  }

  // complete the task
  await taskService.complete(task, processVariables);
});

client.subscribe("collect_list_workers", async function ({ task, taskService }) {
  let processVariables = new Variables();

  if (task.variables.get("are_plumbers_chosen")) {
    processVariables.set("plumbers_list", plumbers_list);
  }

  if (task.variables.get("are_electricians_chosen")) {
    processVariables.set("electricians_list", electricians_list);
  }

  if (task.variables.get("are_constructors_chosen")) {
    processVariables.set("constructors_list", constructors_list);
  }


  // complete the task
  await taskService.complete(task, processVariables);
});

// Plumber's Part
client.subscribe("ask_plumber_quotation", async function ({ task, taskService }) {
  // Here I update the list of quotation
  async function assign_response_plumber(item) {
    let index = task.variables.get("loopCounter");
    item.workerId = index;
    let processVariables = new Variables();
    processVariables.set("plumber_quotation_" + index, item);
    await taskService.complete(task, processVariables);
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "plumber_quotation",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };

  fetch("http://localhost:8084/v1/commissions", {
    method: "POST",
    body: JSON.stringify({
      companyName: company_name,
      workDescription: task.variables.get("description"),
      budget: task.variables.get("budget"),
      startDate: task.variables.get("startDate"),
      endDate: task.variables.get("endDate"),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => (assign_response_plumber(json)));
  // complete the task
});

client.subscribe("discard_quotation_plumber", async function ({ task, taskService }) {
  let processVariables = new Variables();
  processVariables.set("plumber_quotation_" + task.variables.get("loopCounter"), null);
  await taskService.complete(task, processVariables);
});

client.subscribe("check_response_plumber", async function ({ task, taskService }) {
  setTimeout(async function () {
    // Codice da eseguire dopo il ritardo
    let processVariables = new Variables();
    let currentQuotation = "plumber_quotation_" + task.variables.get("loopCounter");
    if (task.variables.get(currentQuotation) != null) {
      processVariables.set("plumber_quotation_result", true);
    } else {
      processVariables.set("plumber_quotation_result", false);
    }
    await taskService.complete(task, processVariables);
  }, 1000 * task.variables.get("loopCounter") + 237 );
});

client.subscribe("add_quotation_plumber", async function ({ task, taskService }) {
  await taskService.complete(task);
});

// Electrician's Part
client.subscribe("ask_electrician_quotation", async function ({ task, taskService }) {
  // Here I update the list of quotation
  async function assign_response_electrician(item) {
    let index = task.variables.get("loopCounter");
    item.workerId = index;
    let processVariables = new Variables();
    processVariables.set("electrician_quotation_" + index, item);
    await taskService.complete(task, processVariables);
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "electrician_quotation",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };

  fetch("http://localhost:8082/v1/works", {
    method: "POST",
    body: JSON.stringify({
      companyName: company_name,
      workDescription: task.variables.get("description"),
      budget: task.variables.get("budget"),
      startDate: task.variables.get("startDate"),
      endDate: task.variables.get("endDate"),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => (assign_response_electrician(json)));
  // complete the task
});

client.subscribe("discard_quotation_electrician", async function ({ task, taskService }) {
  let processVariables = new Variables();
  processVariables.set("electrician_quotation_" + task.variables.get("loopCounter"), null);
  await taskService.complete(task, processVariables);
});

client.subscribe("check_response_electrician", async function ({ task, taskService }) {
  setTimeout(async function () {
    // Codice da eseguire dopo il ritardo
    let processVariables = new Variables();
    let currentQuotation = "electrician_quotation_" + task.variables.get("loopCounter");
    if (task.variables.get(currentQuotation) != null) {
      processVariables.set("electrician_quotation_result", true);
    } else {
      processVariables.set("electrician_quotation_result", false);
    }
    await taskService.complete(task, processVariables);
  }, 1000 * task.variables.get("loopCounter") + 125 );
});

client.subscribe("add_quotation_electrician", async function ({ task, taskService }) {
  await taskService.complete(task);
});

// Constructor's part
client.subscribe("ask_areas", async function ({ task, taskService }) {
  // Here I update the list of quotation
  async function assign_response_area(area) {
    let processVariables = new Variables();
    let index = task.variables.get("loopCounter");
    if (index == 2){
      area= ["Milano"];
    }
    processVariables.set("area_" + index, area);
    await taskService.complete(task, processVariables);
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "constructors_available_areas",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };

  fetch("http://localhost:8081/v1/areas", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => (assign_response_area(json)));
  // complete the task
});

client.subscribe("compare_area", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let index = task.variables.get("loopCounter");
  let area_list = task.variables.get("area_" + index);
  let region = task.variables.get("region");
  if (area_list.includes(region)) {
    processVariables.set("area_"+index, true);
  } else {
    processVariables.set("area_"+ index, false);
    processVariables.set("constructor_quotation_" + index,null);
  }
  await taskService.complete(task, processVariables);
});

client.subscribe("ask_constructor_quotation", async function ({ task, taskService }) {
  // Here I update the list of quotation
  async function assign_response_constructor(item) {
    let index = task.variables.get("loopCounter");
    item.workerId = index;
    let processVariables = new Variables();
    processVariables.set("constructor_quotation_" + index, item);
    await taskService.complete(task, processVariables);
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "constructor_quotation",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };

  fetch("http://localhost:8081/v1/" + task.variables.get("region") + "/jobs", {
    method: "POST",
    body: JSON.stringify({
      companyName: company_name,
      workDescription: task.variables.get("description"),
      budget: task.variables.get("budget"),
      startDate: task.variables.get("startDate"),
      endDate: task.variables.get("endDate"),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => (assign_response_constructor(json)));
  // complete the task
});

client.subscribe("discard_quotation_constructor", async function ({ task, taskService }) {
  let processVariables = new Variables();
  processVariables.set("constructor_quotation_" + task.variables.get("loopCounter"), null);
  await taskService.complete(task, processVariables);
});

client.subscribe("check_response_constructor", async function ({ task, taskService }) {
  setTimeout(async function () {
    // Codice da eseguire dopo il ritardo
    let processVariables = new Variables();
    let currentQuotation = "constructor_quotation_" + task.variables.get("loopCounter");
    if (task.variables.get(currentQuotation) != null) {
      processVariables.set("constructor_quotation_result", true);
    } else {
      processVariables.set("constructor_quotation_result", false);
    }
    await taskService.complete(task, processVariables);
  }, 1000 * task.variables.get("loopCounter") + 100 );
});

client.subscribe("add_quotation_constructor", async function ({ task, taskService }) {
  await taskService.complete(task);
});