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
  phone: "124756189257"
};
let plumber1 = {
  name: "Plumber Bros",
  phone: "124756189257"
};
let plumber2 = {
  name: "Plumber Co",
  phone: "124756189257"
}
let plumbers_list = [plumber, plumber1, plumber2];

// Fake DB Constructor
let constructor = {
  name: "Constructor Family",
  phone: "124756189257"
};
let constructor1 = {
  name: "Constructor Bros",
  phone: "124756189257"
};
let constructor2 = {
  name: "Constructor Co",
  phone: "124756189257"
}
const constructors_list = [constructor, constructor1, constructor2];

// Fake DB Electrician
let electrician = {
  name: "Electrician Family",
  phone: "124756189257"
};
let electrician1 = {
  name: "Electrician Bros",
  phone: "124756189257"
};
let electrician2 = {
  name: "Electrician Co",
  phone: "124756189257"
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
  }, 1000 * task.variables.get("loopCounter") + 237);
});

client.subscribe("add_quotation_plumber", async function ({ task, taskService }) {
  setTimeout(async function () {
    await taskService.complete(task);
  }, 1000 * task.variables.get("loopCounter") + 237);
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
  }, 1000 * task.variables.get("loopCounter") + 125);
});

client.subscribe("add_quotation_electrician", async function ({ task, taskService }) {
  setTimeout(async function () {
    await taskService.complete(task);
  }, 1000 * task.variables.get("loopCounter") + 125);
});

// Constructor's part
client.subscribe("ask_areas", async function ({ task, taskService }) {
  // Here I update the list of quotation
  async function assign_response_area(area) {
    let processVariables = new Variables();
    let index = task.variables.get("loopCounter");
    if (index == 2) {
      area = ["Milano"];
    }
    processVariables.set("area_" + index, area);
    await taskService.complete(task, processVariables);

    await fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "constructors_available_areas",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
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
  setTimeout(async function () {
    let processVariables = new Variables();
    let index = task.variables.get("loopCounter");
    let area_list = task.variables.get("area_" + index);
    let region = task.variables.get("region");
    if (area_list.includes(region)) {
      processVariables.set("area_" + index, true);
    } else {
      processVariables.set("area_" + index, false);
      processVariables.set("constructor_quotation_" + index, null);
    }
    await taskService.complete(task, processVariables);
  }, 167 * task.variables.get("loopCounter"));
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
  }, 1000 * task.variables.get("loopCounter") + 100);
});

client.subscribe("add_quotation_constructor", async function ({ task, taskService }) {
  setTimeout(async function () {
    await taskService.complete(task);
  }, 1000 * task.variables.get("loopCounter") + 100);
});

/*-------------------------------------------------------------------------------------------
SECOND SEGMENT
--------------------------------------------------------------------------------------------*/


client.subscribe("check_availability_for_each_job", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let plumber_quotation_0 = task.variables.get("plumber_quotation_0");
  let plumber_quotation_1 = task.variables.get("plumber_quotation_1");
  let plumber_quotation_2 = task.variables.get("plumber_quotation_2");
  let constructor_quotation_0 = task.variables.get("constructor_quotation_0");
  let constructor_quotation_1 = task.variables.get("constructor_quotation_1");
  let constructor_quotation_2 = task.variables.get("constructor_quotation_2");
  let electrician_quotation_0 = task.variables.get("electrician_quotation_0");
  let electrician_quotation_1 = task.variables.get("electrician_quotation_1");
  let electrician_quotation_2 = task.variables.get("electrician_quotation_2");

  let work_can_be_done = true;

  if (task.variables.get("are_plumbers_chosen")) {
    if (plumber_quotation_0 == null && plumber_quotation_1 == null && plumber_quotation_2 == null) {
      work_can_be_done = false;
    }
  }

  if (task.variables.get("are_electricians_chosen")) {
    if (electrician_quotation_0 == null && electrician_quotation_1 == null && electrician_quotation_2 == null) {
      work_can_be_done = false;
    }
  }

  if (task.variables.get("are_constructors_chosen")) {
    if (constructor_quotation_0 == null && constructor_quotation_1 == null && constructor_quotation_2 == null) {
      work_can_be_done = false;
    }
  }

  processVariables.set("work_can_be_done", work_can_be_done);
  await taskService.complete(task, processVariables);
});

client.subscribe("prepare_message_user", async function ({ task, taskService }) {
  await taskService.complete(task);
});

client.subscribe("prepare_message_constructor", async function ({ task, taskService }) {
  await taskService.complete(task);
});

client.subscribe("contact_constructors", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let constructor_quotation = task.variables.get("constructor_quotation_" + index);

  setTimeout(async function () {
    if (constructor_quotation != null) {
      fetch("http://localhost:8081/v1/confirmations", {
        method: "POST",
        body: JSON.stringify({
          quoteId: constructor_quotation.quoteId,
          message: "Rejected"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index);
});

client.subscribe("prepare_message_electrician", async function ({ task, taskService }) {
  await taskService.complete(task);
});

client.subscribe("contact_electricians", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let electrician_quotation = task.variables.get("electrician_quotation_" + index);

  setTimeout(async function () {
    if (electrician_quotation != null) {
      fetch("http://localhost:8082/v1/contracts", {
        method: "POST",
        body: JSON.stringify({
          workId: electrician_quotation.workId,
          text: "No",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index + 100);
});

client.subscribe("prepare_message_plumber", async function ({ task, taskService }) {
  await taskService.complete(task);
});

client.subscribe("contact_plumbers", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let plumber_quotation = task.variables.get("plumber_quotation_" + index);

  setTimeout(async function () {
    if (plumber_quotation != null) {
      fetch("http://localhost:8084/v1/agreements", {
        method: "POST",
        body: JSON.stringify({
          quoteId: plumber_quotation.quoteId,
          message: "Rejected"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index + 200);
});

client.subscribe("order_lists_by_price", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let plumbers_quotations = [];
  let constructors_quotations = [];
  let electricians_quotations = [];

  for (var index in [0, 1, 2]) {
    let plumber_quotation = task.variables.get("plumber_quotation_" + index);
    let constructor_quotation = task.variables.get("constructor_quotation_" + index);
    let electrician_quotation = task.variables.get("electrician_quotation_" + index);

    if (plumber_quotation != null) {
      plumbers_quotations.push(plumber_quotation);
    }
    if (constructor_quotation != null) {
      constructors_quotations.push(constructor_quotation);
    }
    if (electrician_quotation != null) {
      electricians_quotations.push(electrician_quotation);
    }
  }

  plumbers_quotations.sort(function (a, b) {
    return a.price - b.price;
  });

  constructors_quotations.sort(function (a, b) {
    return a.price - b.price;
  });

  electricians_quotations.sort(function (a, b) {
    return a.price - b.price;
  });

  processVariables.set("plumbers_quotations", plumbers_quotations);
  processVariables.set("constructors_quotations", constructors_quotations);
  processVariables.set("electricians_quotations", electricians_quotations);

  await taskService.complete(task, processVariables);
});

client.subscribe("pick_best_quotations", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let plumbers_quotations = task.variables.get("plumbers_quotations");
  let constructors_quotations = task.variables.get("constructors_quotations");
  let electricians_quotations = task.variables.get("electricians_quotations");

  processVariables.set("best_plumbers_quotation", plumbers_quotations[0]);
  processVariables.set("best_constructors_quotation", constructors_quotations[0]);
  processVariables.set("best_electricians_quotation", electricians_quotations[0]);

  await taskService.complete(task, processVariables);
});

client.subscribe("contact_constructors_losers", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let constructor_quotation = task.variables.get("constructor_quotation_" + index);
  let best_constructor_quotation = task.variables.get("best_constructors_quotation");

  setTimeout(async function () {
    if (constructor_quotation != null && best_constructor_quotation.quoteId != constructor_quotation.quoteId) {
      fetch("http://localhost:8081/v1/confirmations", {
        method: "POST",
        body: JSON.stringify({
          quoteId: constructor_quotation.quoteId,
          message: "Rejected"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index);
});

client.subscribe("contact_electricians_losers", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let electrician_quotation = task.variables.get("electrician_quotation_" + index);
  let best_electrician_quotation = task.variables.get("best_electricians_quotation");

  setTimeout(async function () {
    if (electrician_quotation != null && best_electrician_quotation.workId != electrician_quotation.workId) {
      fetch("http://localhost:8082/v1/contracts", {
        method: "POST",
        body: JSON.stringify({
          workId: electrician_quotation.workId,
          text: "No",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index + 100);
});

client.subscribe("contact_plumbers_losers", async function ({ task, taskService }) {
  let index = task.variables.get("loopCounter");
  let plumber_quotation = task.variables.get("plumber_quotation_" + index);
  let best_plumber_quotation = task.variables.get("best_plumbers_quotation");

  setTimeout(async function () {
    if (plumber_quotation != null && best_plumber_quotation.quoteId != plumber_quotation.quoteId) {
      fetch("http://localhost:8084/v1/agreements", {
        method: "POST",
        body: JSON.stringify({
          quoteId: plumber_quotation.quoteId,
          message: "Rejected"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    await taskService.complete(task);
  }, 1000 * index + 200);
});

client.subscribe("calculate_final_price", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let best_plumber_quotation = task.variables.get("best_plumbers_quotation");
  let best_electrician_quotation = task.variables.get("best_electricians_quotation");
  let best_constructor_quotation = task.variables.get("best_constructors_quotation");

  processVariables.set("final_price", best_plumber_quotation.price + best_electrician_quotation.price + best_constructor_quotation.price);

  await taskService.complete(task, processVariables);
});

client.subscribe("compare_final_price", async function ({ task, taskService }) {
  let processVariables = new Variables();
  let final_price = task.variables.get("final_price");
  let budget = task.variables.get("budget");

  final_price > budget ? processVariables.set("work_can_be_done", false) :
    processVariables.set("work_can_be_done", true);

  await taskService.complete(task, processVariables);
});

client.subscribe("contact_constructors_winner", async function ({ task, taskService }) {
  setTimeout(async function () {
    let best_constructor_quotation = task.variables.get("best_constructors_quotation");

    fetch("http://localhost:8081/v1/confirmations", {
      method: "POST",
      body: JSON.stringify({
        quoteId: best_constructor_quotation.quoteId,
        message: "Rejected"
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

    await taskService.complete(task);
  }, 1000);
});

client.subscribe("contact_electricians_winner", async function ({ task, taskService }) {
  setTimeout(async function () {
    let best_electrician_quotation = task.variables.get("best_electricians_quotation");

    fetch("http://localhost:8082/v1/contracts", {
      method: "POST",
      body: JSON.stringify({
        workId: best_electrician_quotation.workId,
        text: "No",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

    await taskService.complete(task);
  }, 500);
});

client.subscribe("contact_plumbers_winner", async function ({ task, taskService }) {
  let best_plumber_quotation = task.variables.get("best_plumbers_quotation");

  fetch("http://localhost:8084/v1/agreements", {
    method: "POST",
    body: JSON.stringify({
      quoteId: best_plumber_quotation.quoteId,
      message: "Rejected"
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

  await taskService.complete(task);
});


/*-------------------------------------------------------------------------------------------
THIRD SEGMENT
--------------------------------------------------------------------------------------------*/


client.subscribe("contact_winner_constructor", async function ({ task, taskService }) {
  // Put your business logic
  var best_quote_constructor = task.variables.get("best_constructors_quotation");
  fetch("http://localhost:8081/v1/confirmations", {
    method: "POST",
    body: JSON.stringify({
      quoteId: best_quote_constructor.quoteId,
      message: "Confirmed"
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

client.subscribe("contact_winner_electrician", async function ({ task, taskService }) {
  // Put your business logic
  var best_quote_electrician = task.variables.get("best_electricians_quotation");
  fetch("http://localhost:8082/v1/contracts", {
    method: "POST",
    body: JSON.stringify({
      workId: best_quote_electrician.workId,
      text: "ultra cool description of the contract"
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
      messageName: "electrician_work_done",
      processVariables: {
        electricianworkdone: { value: true, type: "Boolean" }
      }
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
});

client.subscribe("contact_winner_plumber", async function ({ task, taskService }) {
  // Put your business logic
  let best_quote_plumber = task.variables.get("best_plumbers_quotation");
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

client.subscribe("ask_status", async function ({ task, taskService }) {
  // Put your business logic
  async function assign_workdone_plumber(item) {
    await taskService.complete(task);
    let status = true;
    if (item == "Working") {
      status = false
    }
    fetch("http://localhost:8080/engine-rest/message", {
      method: "POST",
      body: JSON.stringify({
        messageName: "plumber_work_done",
        processVariables: {
          plumberworkdone: { value: status, type: "Boolean" }
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  };
  let best_quote_plumber = task.variables.get("best_plumbers_quotation");
  fetch("http://localhost:8084/v1/status/" + best_quote_plumber.quoteId, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => (assign_workdone_plumber(json)));

});

client.subscribe("inform_householder", async function ({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("get_money", async function ({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("archive_order", async function ({ task, taskService }) {
  // Put your business logic
  // complete the task
  await taskService.complete(task);
});

client.subscribe("retrieve_contact_constructor", async function ({ task, taskService }) {
  // Put your business logic
  var best_quote_constructor = task.variables.get("best_constructors_quotation");
  const processVariables = new Variables();
  let contact = constructors_list[(best_quote_constructor.workerId)]
  processVariables.set("phone_constructor", (contact.phone));
  // complete the task
  await taskService.complete(task, processVariables);
});

client.subscribe("retrieve_contact_electrician", async function ({ task, taskService }) {
  // Put your business logic
  var best_quote_electrician = task.variables.get("best_electricians_quotation");
  const processVariables = new Variables();
  let contact = electricians_list[(best_quote_electrician.workerId)]
  processVariables.set("phone_electrician", (contact.phone));
  // complete the task
  await taskService.complete(task, processVariables);
});