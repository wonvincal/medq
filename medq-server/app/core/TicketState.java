package core;

/***
 * 
 * @author Calvin
 *
 */
public enum TicketState {
	PROCESSING, // In progress
	NEXT, 		// Next
	ARRIVED,	// Arrived at the place
	REGISTERED,	// Registered in person or on phone
	SCHEDULED	// Scheduled an appointment, but hasn't registered in person or on phone
}
