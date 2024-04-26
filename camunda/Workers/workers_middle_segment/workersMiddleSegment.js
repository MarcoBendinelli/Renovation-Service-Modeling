import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

const plumber_quotation_0 = {
    quoteId: 0,
    price: 100,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};

const plumber_quotation_1 = {
    quoteId: 1,
    price: 200,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};

const plumber_quotation_2 = {
    quoteId: 2,
    price: 300,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};

const constructor_quotation_0 = {
    price: 30,
    workDays: 3,
    quoteId: 0,
};

const constructor_quotation_1 = {
    price: 60,
    workDays: 3,
    quoteId: 1,
};

const constructor_quotation_2 = {
    price: 20,
    workDays: 3,
    quoteId: 2,
};

const electrician_quotation_0 = {
    workId: 0,
    customerId: 2,
    price: 60,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};

const electrician_quotation_1 = {
    workId: 1,
    customerId: 2,
    price: 50,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};

const electrician_quotation_2 = {
    workId: 2,
    customerId: 2,
    price: 20,
    workDays: 3,
    startDate: "data",
    endDate: "date"
};


client.subscribe("mock_task", async function ({ task, taskService }) {
    let processMockVariables = new Variables();
    let choosen_workers = task.variables.get("work_needed");

    choosen_workers.includes("Plumber") ? processMockVariables.set("are_plumbers_chosen", true) :
        processMockVariables.set("are_plumbers_chosen", false);

    choosen_workers.includes("Electrician") ? processMockVariables.set("are_electricians_chosen", true) :
        processMockVariables.set("are_electricians_chosen", false);

    choosen_workers.includes("Constructor") ? processMockVariables.set("are_constructors_chosen", true) :
        processMockVariables.set("are_constructors_chosen", false);

    processMockVariables.set("plumber_quotation_0", plumber_quotation_0);
    processMockVariables.set("plumber_quotation_1", plumber_quotation_1);
    processMockVariables.set("plumber_quotation_2", plumber_quotation_2);

    processMockVariables.set("constructor_quotation_0", constructor_quotation_0);
    processMockVariables.set("constructor_quotation_1", constructor_quotation_1);
    processMockVariables.set("constructor_quotation_2", constructor_quotation_2);

    processMockVariables.set("electrician_quotation_0", electrician_quotation_0);
    processMockVariables.set("electrician_quotation_1", electrician_quotation_1);
    processMockVariables.set("electrician_quotation_2", electrician_quotation_2);

    // complete the task
    await taskService.complete(task, processMockVariables);
});

client.subscribe("check_availability_for_each_job", async function ({ task, taskService }) {
    let processVariables = new Variables();
    let choosen_workers = task.variables.get("work_needed");
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

    if (choosen_workers.includes("Plumber")) {
        if (plumber_quotation_0 == null && plumber_quotation_1 == null && plumber_quotation_2 == null) {
            work_can_be_done = false;
        }
    }

    if (choosen_workers.includes("Electrician")) {
        if (electrician_quotation_0 == null && electrician_quotation_1 == null && electrician_quotation_2 == null) {
            work_can_be_done = false;
        }
    }

    if (choosen_workers.includes("Constructor")) {
        if (constructor_quotation_0 == null && constructor_quotation_1 == null && constructor_quotation_2 == null) {
            work_can_be_done = false;
        }
    }

    if (choosen_workers.length <= 0) {
        work_can_be_done = false;
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
        if (electrician_quotation != null && best_electrician_quotation.quoteId != electrician_quotation.quoteId) {
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