# Renovation House Modeling :house_with_garden:

The project aims to model the service provided by a house renovation company to its clients. This service involves coordinating various workers such as plumbers, electricians, and constructors. The process begins with client requests, which prompt the service to contact and select the most suitable providers.

To model this complex process, **choreography** and **collaboration** diagrams using **BPMN** (Business Process Model and Notation) are employed. These diagrams visualize the interactions and handoffs between different parties involved in the renovation process, ensuring smooth coordination.

Additionally, **Petri net** is used to represent the dynamic behavior of the system. Petri net provides a graphical and mathematical framework for modeling concurrent processes, enabling us to analyze the flow of activities and resources within the renovation service.

## Members:
* Marco, Bendinelli
* Stefano, Taborelli
* Riccardo, Gelato

## Overview of the process
This is an elicopter view of the process managed by the house renovation company:
* Starts with the request of the house holder. In the request there are all details of their project.
* HRC checks the validity of the project and sends a response to the client. (If bad, the process ends).
* HRC asks to all the workers involved a quotation for the project.
* If the project could not be complete at least by one of the type of worker needed, the process ends.
* HRC computes the best solution for the client and it informs the loosers
* HRC computes the total price to see if the client can afford the works. If they can it will inform the winners to start the works and it will provide all the informations needed, otherwise it will inform them to not start. In case of overbudget the client is informed and process is ended.
* After the beginnning of works, HRC monitor the works to know when they are finished. If needed it will hasten to have feedback.
* Once done it will inform the client and will proceed with the payment.


## Third party services
[Here](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/tree/main/services) there will be all the files used to debloy the API servers of workers
* [plumber](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/tree/main/services/plumber)
* [electrician](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/tree/main/services/electrician)
* [constructor](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/tree/main/services/constructor)

## Models of the service
Here there is a first glanse to models used to describe all the process. Click [here](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/tree/main/processes) to go the folder with all the files used.
### [Choreographed process](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/blob/main/processes/choreography.pdf)

### [Collaboration Diagram](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/blob/main/processes/collaboration.pdf)

### [Executable process](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/blob/main/processes/executable.jpg)

### [Petri Net](https://github.com/MarcoBendinelli/Renovation-Service-Modeling/blob/main/processes/petrinet.pdf)
