package core;

public class QueueEvent extends Event {
	private QueueEventType eventType;
	private long toTicketId;
	private long fromTicketId;
	private TicketState toTicketState;
	
	public QueueEventType getEventType(){
		return eventType;
	}
	
	public void setEventType(QueueEventType value){
		eventType = value;
	}
	
	public long getToTicketId(){
		return toTicketId;
	}

	public long getFromTicketId(){
		return fromTicketId;
	}

	public TicketState getToTicketState(){
		return toTicketState;
	}
	
	// TODO - how to change other ticket info
}
