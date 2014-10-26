package core;

public enum QueueEventType {
	// Queue level change
	ADD_TICKET,
	DELETE_TICKET,
	INSERT_TICKET,
	MOVE_TICKET,
	
	// Ticket level change
	CHANGE_TICKET_STATE,
	CHANGE_TICKET_INFO
	
	// Appointment level change
	// Client automatically handles the diff
	// New ticket 
}
