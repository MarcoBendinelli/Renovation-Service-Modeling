# ReNewHouse
We want to model the service offered by a house renovation company to its clients. The house renovation company service relies on the services offered by a set of plumbers, electrician, constructors
Based on the requests of the client (the householder) contact them and select the best ones

## Members:
* Stefano, Taborelli, 10608112
* Riccardo, Gelato, 10662797
* Marco, Bendinelli, 10673478

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
[Here](https://github.com/stefanotaborelli/ReNewHouse/tree/main/services) there will be all the files used to debloy the API servers of workers
* [plumber](https://github.com/stefanotaborelli/ReNewHouse/tree/main/services/plumber)
* [electrician](https://github.com/stefanotaborelli/ReNewHouse/tree/main/services/electrician)
* [constructor](https://github.com/stefanotaborelli/ReNewHouse/tree/main/services/constructor)

## Models of the service
Here there is a first glanse to models used to describe all the process. Click [here](https://github.com/stefanotaborelli/ReNewHouse/tree/main/processes) to go the folder with all the files used.
### [Choreographed process](https://github.com/stefanotaborelli/ReNewHouse/blob/main/processes/choreography.pdf)

### [Collaboration Diagram](https://github.com/stefanotaborelli/ReNewHouse/blob/main/processes/collaboration.pdf)

### [Executable process](https://github.com/stefanotaborelli/ReNewHouse/blob/main/processes/executable.jpg)

### [Petri Net](https://github.com/stefanotaborelli/ReNewHouse/blob/main/processes/petrinet.pdf)
